import * as ethers from 'ethers'
import config from "../config.json"
import fs from "fs"

// Tracer program that extracts uniswapv2 trades
const traceProg = fs.readFileSync(__dirname + "/tracer.js", "utf-8")

interface TradeEvents {
  tx: ethers.ethers.providers.TransactionResponse,
  trades: Array<{
    pool: string,
    reserve0: string,
    reserve1: string
  }>
}


export async function watchForTrades(emit: (v: TradeEvents) => void) {
  let knownSet = new Set<string>()
  let knownList: string[] = []
  let knownSetTimestamp = new Map<string, number>()
  const wsProvider = new ethers.providers.WebSocketProvider(config.providerUrl)
  const httpProvider = new ethers.providers.JsonRpcProvider(config.providerUrlHTTP)

  const wsProviderPublic = new ethers.providers.WebSocketProvider(
    "wss://api.avax.network/ext/bc/C/ws"
  )
  const httpProviderPublic = new ethers.providers.JsonRpcProvider(
    "https://api.avax.network/ext/bc/C/rpc"
  )
  
  const process = (
    provider: ethers.providers.JsonRpcProvider
  ) => async (hash: string) => {
    if (knownSet.has(hash)) {
      return
    }
    knownSetTimestamp.set(hash, Date.now())
    knownSet.add(hash)
    knownList.push(hash)

    // only remember the last 1k elements, and resize if we go above
    if (knownList.length > 1024) {
      knownSet = new Set<string>(knownList.slice(knownList.length - 64))
      knownList = []
    }
    const tx = await provider.getTransaction(hash)
    try {
      const trace = await httpProvider.send("debug_traceCall", [{
        "from": tx.from,
        "value": "0x" + tx.value?.toBigInt().toString(16),
        "to": tx.to,
        "data": tx.data
      },
        "latest",
      {
        tracer: traceProg
      }
      ])
      if (trace.failed || trace.trades.length === 0) {
        return
      }
      emit({
        tx,
        trades: trace.trades
      })
    } catch (e) {
      // console.log(e)
    }
  }
  wsProvider.on("pending", process(httpProvider))
  wsProviderPublic.on("pending", process(httpProviderPublic))
}