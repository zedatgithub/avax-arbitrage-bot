import * as ethers from 'ethers'
import { watchForTrades } from "./mempoolwatcher"
import q1 from '../traderjoe.json'
import df from '../pangolin.json'
import party from '../party.json'
import lydia from '../lydia.json'
import univ2abi from "./abis/univ2.json"
import multiCallAbi from "./abis/multicall.json"
import { TraderNew__factory } from "../typechain"
import config from "../config.json"

import baguette from '../baguette.json'
import canary from '../canary.json'
import elk from '../elk.json'
import yeti from '../yeti.json'

require('dotenv').config()
const traderAddress = config.traderAddress

interface Token {
  id: string
  symbol: string
  name: string
  decimals: number
  pools: Pool[]
  poolsMap: Map<Token, Pool[]>
}
interface Reserve {
  reserve0: bigint
  reserve1: bigint
}
interface Pool {
  id: string
  token0: Token
  token1: Token
  reserve0: bigint
  reserve1: bigint
}
interface Trade {
  swapFrom: Token
  swapTo: Token
  zeroForOne: boolean
  pool: Pool
}
type Path = Trade[]

// Computes optimal trades size based on a series of trades
export const getEaEb = (path: Path, overrides: Record<string, Reserve> = {}): [bigint, bigint] => {
  let Ea = 0n
  let Eb = 0n
  {
    const e0 = path[0]
    const e1 = path[1]
    const e0p = overrides[path[0].pool.id] ? overrides[path[0].pool.id] : path[0].pool
    const e1p = overrides[path[1].pool.id] ? overrides[path[1].pool.id] : path[1].pool

    const [Ra, Rb] = e0.zeroForOne ? [e0p.reserve0, e0p.reserve1] : [e0p.reserve1, e0p.reserve0]
    const [Rb1, Rc] = e1.zeroForOne ? [e1p.reserve0, e1p.reserve1] : [e1p.reserve1, e1p.reserve0]
    Ea = (1000n * Ra * Rb1) / (1000n * Rb1 + 997n * Rb)
    Eb = (997n * Rb * Rc) / (1000n * Rb1 + 997n * Rb)
  }
  for (let idx = 2; idx < path.length; idx++) {
    const e = path[idx]
    const ep = overrides[path[idx].pool.id] ? overrides[path[idx].pool.id] : path[idx].pool
    const Rb = Eb
    const [Rb1, Rc] = e.zeroForOne ? [ep.reserve0, ep.reserve1] : [ep.reserve1, ep.reserve0]
    Ea = 1000n * Ea * Rb1 / (1000n * Rb1 + 997n * Rb)
    Eb = 997n * Rb * Rc / (1000n * Rb1 + 997n * Rb)
  }
  return [Ea, Eb]
}
const getOptimalAmount = (path: Path, overrides: Record<string, Reserve> = {}): null | bigint => {
  const [Ea, Eb] = getEaEb(path, overrides)
  if (Ea > Eb) {
    return null
  }

  let optimal = Ea * Eb * 997n * 1000n;
  // sqrt(optimal)
  let z = (optimal + 1n) / 2n;
  let y = optimal;
  while (z < y) {
    y = z;
    z = (optimal / z + z) / 2n;
  }
  return (y - Ea * 1000n) / 997n
}

// Evaluates the result of executing a trade
function getAmountOut(amountIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint {
  let amountInWithFee = amountIn * 997n;
  let numerator = amountInWithFee * reserveOut;
  let denominator = (reserveIn * 1000n) + amountInWithFee;
  return numerator / denominator;
}
function getAmountOutPath(amountIn: bigint, path: Path, overrides: Record<string, Reserve> = {}): bigint[] {
  const out = []
  for (let p of path) {
    const {reserve0, reserve1} = overrides[p.pool.id] ? overrides[p.pool.id] : p.pool
    if (p.zeroForOne) {
      amountIn = getAmountOut(amountIn, reserve0, reserve1)
      out.push(0n, amountIn)
    } else {
      amountIn = getAmountOut(amountIn, reserve1, reserve0)
      out.push(amountIn, 0n)
    }
  }
  return out
}

const oppositeToken = (pool: Pool, tok: Token): Token => {
  if (pool.token0 === tok) {
    return pool.token1
  }
  return pool.token0
}

const makeTrade = (pool: Pool, swapFrom: Token): Trade => {
  return {
    pool,
    swapFrom,
    swapTo: oppositeToken(pool, swapFrom),
    zeroForOne: pool.token0 === swapFrom
  }
}

// This code constructs a graph from dex pools.
// tokens are the vertices, while the pools represent edges
const edges: Record<string, Pool> = {}
const nodes: Record<string, Token> = {}
const findToken = (tok: any): Token => {
  if (nodes[tok.id] == null) {
    nodes[tok.id] = { ...tok, decimals: parseInt(tok.decimals), pools: [], poolsMap: new Map() }
  }
  return nodes[tok.id]
}
const BANNED = new Set(config.bannedTokens)
const processPair = (p: (typeof q1)["data"]["pairs"][0]) => {
  if (BANNED.has(p.token0.id) || BANNED.has(p.token1.id)) {
    return
  }
  edges[p.id] = {
    id: p.id,
    token0: findToken(p.token0),
    token1: findToken(p.token1),
    reserve0: 0n,
    reserve1: 0n,
  }
}

q1.data.pairs.forEach(processPair)
df.data.pairs.forEach(processPair)
party.data.pairs.forEach(processPair)
lydia.data.pairs.forEach(processPair)
baguette.data.pairs.forEach(processPair)
canary.data.pairs.forEach(processPair)
elk.data.pairs.forEach(processPair)
yeti.data.pairs.forEach(processPair)

Object.keys(edges).forEach(poolAddr => {
  const pool = edges[poolAddr];
  pool.token0.pools.push(pool)
  pool.token0.poolsMap.set(pool.token1, pool.token0.poolsMap.get(pool.token1) || [])
  pool.token0.poolsMap.get(pool.token1).push(pool)

  pool.token1.pools.push(pool)
  pool.token1.poolsMap.set(pool.token0, pool.token1.poolsMap.get(pool.token0) || [])
  pool.token1.poolsMap.get(pool.token0).push(pool)

  nodes[pool.token0.id] = pool.token0
  nodes[pool.token1.id] = pool.token1
})

const printPath = (p: Path): string => p.map(t => t.swapFrom.symbol + "/" + t.swapTo.symbol).join(" -> ")

// Computes all potential paths to perform an arbitrage trade for initialToken
// maxLength limits the path length as this will lead to exponential blowup pretty fast
const computePaths = (initialToken: Token, maxLength: number, endToken: Token = initialToken): Path[] => {
  const paths: Path[] = []
  const computePathsInner = (path: Path, visitedPools: Set<Pool>, visitedTokens: Set<Token>, n: number) => {
    if (n === 1) {
      return;
    }
    const lastAdded = path[path.length - 1]
    for (let pool of lastAdded.swapTo.pools) {
      if (visitedPools.has(pool)) {
        continue
      }
      const opposite = oppositeToken(pool, lastAdded.swapTo)
      if (path.length != 1 && endToken === opposite) {
        paths.push([...path, makeTrade(pool, lastAdded.swapTo)])
        continue;
      }

      if (visitedTokens.has(opposite)) {
        continue
      }

      computePathsInner(
        [...path, makeTrade(pool, lastAdded.swapTo)],
        new Set([...visitedPools, pool]),
        new Set([...visitedTokens, opposite]),
        n - 1
      )
    }
  }
  initialToken.pools.forEach(initialPool => {
    const initialTrade = makeTrade(initialPool, initialToken)
    computePathsInner(
      [initialTrade],
      new Set([initialPool]),
      new Set([initialToken]),
      maxLength
    )
  })
  return paths
}

const strategies = config.strategies.map(strategy => {
  const ROOT = nodes[strategy.startToken]
  const endToken = nodes[strategy.endToken];

  let paths = computePaths(ROOT, strategy.maxLength, endToken)

  return {
    ...strategy,
    endToken,
    paths,
    minProfitInTokenAmount: ethers.utils.parseUnits(strategy.minProfit, endToken.decimals).toBigInt(),
    breakProfitInTokenAmount: ethers.utils.parseUnits(strategy.breakProfit, endToken.decimals).toBigInt()
  }
})


export const main = async () => {
  const provider = new ethers.providers.WebSocketProvider(config.providerUrl,
    { chainId: 43114, name: "Avalanche" }
  )

  const signer = new ethers.Wallet(Buffer.from(process.env.PRIVATE_KEY.slice(2), 'hex')).connect(provider)

  const multicallContract = new ethers.Contract(
    config.multicall,
    multiCallAbi,
    provider
  )

  // Pull in reserves for all pools
  const allPoolAddresses = Object.keys(edges)
  const uniInterface = new ethers.utils.Interface(univ2abi)
  const getReservesCall = uniInterface.encodeFunctionData("getReserves")
  const calls = allPoolAddresses.map(target => ({ target, callData: getReservesCall }))
  console.log("Fetching reserves")
  const result = await multicallContract.callStatic.aggregate(calls, { from: "0x0000000000000000000000000000000000000000" })
  for (let i = 0; i < result.returnData.length; i++) {
    const data = result.returnData[i]
    const address = allPoolAddresses[i]
    const pool = edges[address]
    pool.reserve0 = BigInt('0x' + data.slice(2, 2 + 64))
    pool.reserve1 = BigInt('0x' + data.slice(2 + 64, 2 + 64 + 64))
  }
  console.log("Done")

  let lockedPaths = new Set<Path>()
  provider.on({
    topics: ["0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"]
  }, e => {
    const addr = e.address.toLowerCase();
    if (edges[addr] == null) {
      return
    }
    const pool = edges[addr]
    pool.reserve0 = BigInt('0x' + e.data.slice(2, 2 + 64))
    pool.reserve1 = BigInt('0x' + e.data.slice(2 + 64))
  })

  const trader = TraderNew__factory.connect(traderAddress, provider).connect(signer)

  let nonce = await signer.getTransactionCount()

  let baseGasPrice = await signer.getGasPrice()
  let maxPrioFee = ethers.utils.parseUnits("18", 9).toBigInt()
  let gp = baseGasPrice.toBigInt() + maxPrioFee

  let previous = null
  let block = null
  provider.on("block", async block_ => {
    block = block_
    baseGasPrice = await signer.getGasPrice()
  })

  watchForTrades(trades => {
    gp = baseGasPrice.toBigInt() + maxPrioFee

    if (block == previous) {
      return
    }
    if (block == null) {
      return
    }
    previous = block;

    const minProfit = gp * 300000n;

    const overrides: Record<string, Reserve> = {}
    trades.trades.forEach(t => {
      overrides[t.pool] = {
        reserve0: BigInt(t.reserve0),
        reserve1: BigInt(t.reserve1),
      }
    })

    strategies.map(async strategy => {
      const possiblePaths = strategy.paths
      let optimalPaths: [Path, bigint, bigint[], bigint][] = []

      for (let path of possiblePaths) {
        if (lockedPaths.has(path)) {
          continue
        }
        const optimal = getOptimalAmount(path, overrides)

        if (optimal == null || optimal < 0n) {
          continue
        }

        const output = getAmountOutPath(optimal, path, overrides)
        const profit = (output[output.length - 1] + output[output.length - 2]) - optimal
        if (profit < minProfit) {
          continue
        }
        optimalPaths.push([path, optimal, output, profit])
        break
      }

      if (optimalPaths.length == 0) {
        return
      }

      optimalPaths = optimalPaths.sort((l, r) => Number(r[3] - l[3]))
      console.log("Executing trades");

      await Promise.all(optimalPaths.map(async ([bestTradePath, inputAmount, outputs, profit]) => {
        const pools = bestTradePath.map(p => p.pool.id)
        const reserves: bigint[] = bestTradePath.map(i => i.pool.reserve0 * i.pool.reserve1)
        try {

          console.log("Executing " + printPath(bestTradePath))
          console.log("Expected profit " + ethers.utils.formatEther(profit))

          const tx = await trader.arbTradeFlash(
            inputAmount,
            outputs,
            pools,
            reserves,
            bestTradePath[bestTradePath.length - 1].swapTo.id,
            trades.tx.maxPriorityFeePerGas == null ? {
              gasPrice: trades.tx.gasPrice,
              nonce: nonce++,
              gasLimit: 300000,
            } :  {
              maxPriorityFeePerGas: trades.tx.maxPriorityFeePerGas,
              nonce: nonce++,
              gasLimit: 300000,
            }
          )
          console.log("Hash: " + tx.hash)
        } catch (e) {
          console.log(e)
          console.log(printPath(bestTradePath) + " failed")
        }
      }))
    })
  })
}