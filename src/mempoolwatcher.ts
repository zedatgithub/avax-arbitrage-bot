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
  const wsProvider = new ethers.providers.WebSocketProvider(config.providerUrl)
  const httpProvider = new ethers.providers.JsonRpcProvider(config.providerUrlHTTP)

  wsProvider.on("pending", async (hash: string) => {
    const tx = await wsProvider.getTransaction(hash)
    const start = Date.now()
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
  })
}