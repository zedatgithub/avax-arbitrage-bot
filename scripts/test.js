const hre = require("hardhat");

async function main() {
  await hre.network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: "https://api.avax.network/ext/bc/C/rpc",
          blockNumber: 9012121
        },
      },
    ],
  });
  
  const TraderNew = await hre.ethers.getContractFactory("TraderNew");
  const inst = await TraderNew.deploy();

  console.log("Simulating")
  const res = await inst.callStatic.arbTradeFlash(
    "47949027660433680227",
    [ "2659154540526617502966", "0", "0", "5463367313", "48026039000037627909", "0" ],
    [ '0x454e67025631c065d3cfad6d71e6892f74487a15', '0x1643de2efb8e35374d796297a9f95f64c082a8ce', '0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256' ],
    [ "6895981364612009496135560723964397056277083539138", "7414679281635959442653916070467771830", "51339786662965275607062627600056581352" ],
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
  )

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });