const hre = require("hardhat");


async function main() {
    await hre.network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: "https://api.avax.network/ext/bc/C/rpc",
            blockNumber: 8502982
          },
        },
      ],
    });
    console.log("Simulating")
    const TraderSimulator = await hre.ethers.getContractFactory("TraderSimulator");
    const inst = await TraderSimulator.deploy();

    const Trader = await hre.ethers.getContractFactory("Trader");
    const traderInst = await Trader.deploy();
    const instAddr = inst.address.slice(2).toLowerCase().padEnd(40, '0')
    const traderAddr = traderInst.address.slice(2).toLowerCase().padEnd(40, '0')

    const res = await inst.callStatic.arbTradeFlash(
      '0x6',
      [
        '0x239aae4aabb5d60941d7dffaeafe8e063c63ab25',
        '0x720dd9292b3d0dd78c9afa57afd948c2ea2d50d8',
        '0x51ccf2e04dc587dcfe8f0ddc30425f1bea21807f'
      ],
      '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'
    )
    const calls = res[1].filter(i => i.target !== '0x0000000000000000000000000000000000000000')
    console.log(ethers.utils.formatEther(res[0]))
    const firstCall = calls[0]
    const restCalls = calls.slice(1).map(call => ({
      target: call.target,
      data: call.data.replace(instAddr, traderAddr)
    }))
    
    const amount0 = "0x" + firstCall.data.slice(10, 10 + 64)
    const amount1 = "0x" + firstCall.data.slice(10 + 64, 10 + 64 + 64)
    const gasUse = await traderInst.estimateGas.arbTradeFlash(firstCall.target, amount0, amount1, restCalls)
    console.log(gasUse.toString())

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
 .then(() => process.exit(0))
 .catch((error) => {
   console.error(error);
   process.exit(1);
 });