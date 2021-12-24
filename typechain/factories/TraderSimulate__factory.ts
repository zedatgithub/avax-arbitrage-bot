/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TraderSimulate,
  TraderSimulateInterface,
} from "../TraderSimulate";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "directions",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "outToken",
        type: "address",
      },
    ],
    name: "arbTradeFlash",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct TraderSimulate.Call[32]",
        name: "",
        type: "tuple[32]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "uniswapV2Call",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600060405534801561001557600080fd5b50611c1a806100256000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806310d1e85c1461003b578063fc45ad8014610050575b600080fd5b61004e6100493660046115a0565b61007a565b005b61006361005e366004611762565b610787565b60405161007192919061190d565b60405180910390f35b600080808061008b85870187611631565b935093509350935060008089600014156101a0573373ffffffffffffffffffffffffffffffffffffffff1663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b1580156100e557600080fd5b505afa1580156100f9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061011d9190611584565b3373ffffffffffffffffffffffffffffffffffffffff16630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b15801561016357600080fd5b505afa158015610177573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061019b9190611584565b61029c565b3373ffffffffffffffffffffffffffffffffffffffff16630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b1580156101e657600080fd5b505afa1580156101fa573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061021e9190611584565b3373ffffffffffffffffffffffffffffffffffffffff1663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b15801561026457600080fd5b505afa158015610278573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061029c9190611584565b9150915061038c8263a9059cbb60e01b866001815181106102cd57634e487b7160e01b600052603260045260246000fd5b60200260200101518c8e6102e19190611a63565b60405173ffffffffffffffffffffffffffffffffffffffff909216602483015260448201526064015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff0000000000000000000000000000000000000000000000000000000090931692909217909152610b2a565b60015b84518110156107395760008582815181106103ba57634e487b7160e01b600052603260045260246000fd5b602002602001015190506000806000846001901b8a166000141561045b578373ffffffffffffffffffffffffffffffffffffffff1663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b15801561041e57600080fd5b505afa158015610432573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104569190611584565b6104d9565b8373ffffffffffffffffffffffffffffffffffffffff16630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b1580156104a157600080fd5b505afa1580156104b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104d99190611584565b90506000808c6104ea886002611a9b565b8151811061050857634e487b7160e01b600052603260045260246000fd5b60200260200101518d88600261051e9190611a9b565b610529906001611a63565b8151811061054757634e487b7160e01b600052603260045260246000fd5b602002602001015191509150610629828473ffffffffffffffffffffffffffffffffffffffff166370a082318e8b8151811061059357634e487b7160e01b600052603260045260246000fd5b60200260200101516040518263ffffffff1660e01b81526004016105d3919073ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b60206040518083038186803b1580156105eb57600080fd5b505afa1580156105ff573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610623919061174a565b90610caa565b9450610636858383610ccb565b9350505050600080856001901b8b166000141561065557826000610659565b6000835b91509150600060018b5161066d9190611ad8565b87146106aa578a61067f886001611a63565b8151811061069d57634e487b7160e01b600052603260045260246000fd5b60200260200101516106ac565b305b90506107208b88815181106106d157634e487b7160e01b600052603260045260246000fd5b60209081029190910181015160408051600081529283019052907f022c0d9f000000000000000000000000000000000000000000000000000000009061030a90879087908790604481016119ab565b505050505050808061073190611b5a565b91505061038f565b506040513360248201526044810184905261077a9082907fa9059cbb000000000000000000000000000000000000000000000000000000009060640161030a565b5050505050505050505050565b60006107916113f2565b60006107d18686808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152508b9250610e45915050565b905060006107de82611090565b905060008060018a1661084d57610846838560008151811061081057634e487b7160e01b600052603260045260246000fd5b60200260200101518660018151811061083957634e487b7160e01b600052603260045260246000fd5b6020026020010151610ccb565b600061089d565b600061089d848660008151811061087457634e487b7160e01b600052603260045260246000fd5b60200260200101518760018151811061083957634e487b7160e01b600052603260045260246000fd5b915091506000848b8b8b876040516020016108bc959493929190611855565b604051602081830303815290604052905061093f8a8a60008181106108f157634e487b7160e01b600052603260045260246000fd5b90506020020160208101906109069190611561565b6040517f022c0d9f000000000000000000000000000000000000000000000000000000009061030a9087908790309088906024016119ab565b506040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009073ffffffffffffffffffffffffffffffffffffffff8916906370a082319060240160206040518083038186803b1580156109a857600080fd5b505afa1580156109bc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109e0919061174a565b60405133602482015260448101829052909150610a239089907fa9059cbb000000000000000000000000000000000000000000000000000000009060640161030a565b604080516104008101909152819060009081602081835b82821015610b125760408051808201909152600283028501805473ffffffffffffffffffffffffffffffffffffffff168252600181018054602084019190610a8190611b1f565b80601f0160208091040260200160405190810160405280929190818152602001828054610aad90611b1f565b8015610afa5780601f10610acf57610100808354040283529160200191610afa565b820191906000526020600020905b815481529060010190602001808311610add57829003601f168201915b50505050508152505081526020019060010190610a3a565b50505050905096509650505050505094509492505050565b60408051808201825273ffffffffffffffffffffffffffffffffffffffff8416815260208101839052815490916000919082610b6583611b5a565b9190505560208110610b8757634e487b7160e01b600052603260045260246000fd5b82516002919091029190910180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff9092169190911781556020808301518051610bed926001850192019061142d565b509050506000808373ffffffffffffffffffffffffffffffffffffffff1683604051610c199190611839565b6000604051808303816000865af19150503d8060008114610c56576040519150601f19603f3d011682016040523d82523d6000602084013e610c5b565b606091505b5091509150818190610ca3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c9a91906118fa565b60405180910390fd5b5050505050565b600082610cb78382611ad8565b9150811115610cc557600080fd5b92915050565b6000808411610d5c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f556e697377617056324c6962726172793a20494e53554646494349454e545f4960448201527f4e5055545f414d4f554e540000000000000000000000000000000000000000006064820152608401610c9a565b600083118015610d6c5750600082115b610df8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f556e697377617056324c6962726172793a20494e53554646494349454e545f4c60448201527f49515549444954590000000000000000000000000000000000000000000000006064820152608401610c9a565b6000610e06856103e56113aa565b90506000610e1482856113aa565b90506000610e2e83610e28886103e86113aa565b906113d7565b9050610e3a8183611a7b565b979650505050505050565b606082516002610e559190611a9b565b67ffffffffffffffff811115610e7b57634e487b7160e01b600052604160045260246000fd5b604051908082528060200260200182016040528015610ea4578160200160208202803683370190505b50905060005b835181101561108957600080858381518110610ed657634e487b7160e01b600052603260045260246000fd5b602002602001015173ffffffffffffffffffffffffffffffffffffffff16630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b158015610f2357600080fd5b505afa158015610f37573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f5b91906116fc565b506dffffffffffffffffffffffffffff91821693501690506001831b851615610ffb578184610f8b856002611a9b565b81518110610fa957634e487b7160e01b600052603260045260246000fd5b60209081029190910101528084610fc1856002611a9b565b610fcc906001611a63565b81518110610fea57634e487b7160e01b600052603260045260246000fd5b602002602001018181525050611074565b8084611008856002611a9b565b8151811061102657634e487b7160e01b600052603260045260246000fd5b6020908102919091010152818461103e856002611a9b565b611049906001611a63565b8151811061106757634e487b7160e01b600052603260045260246000fd5b6020026020010181815250505b5050808061108190611b5a565b915050610eaa565b5092915050565b600080600080600091509150600080856000815181106110c057634e487b7160e01b600052603260045260246000fd5b6020026020010151866001815181106110e957634e487b7160e01b600052603260045260246000fd5b6020026020010151915091506000808760028151811061111957634e487b7160e01b600052603260045260246000fd5b60200260200101518860038151811061114257634e487b7160e01b600052603260045260246000fd5b602002602001015191509150826103e561115c9190611a9b565b611168836103e8611a9b565b6111729190611a63565b8261117f866103e8611a9b565b6111899190611a9b565b6111939190611a7b565b95506111a1836103e5611a9b565b6111ad836103e8611a9b565b6111b79190611a63565b816111c4856103e5611a9b565b6111ce9190611a9b565b6111d89190611a7b565b9450600493505050505b84518110156112f657600082905060008087848151811061121357634e487b7160e01b600052603260045260246000fd5b6020026020010151888560016112299190611a63565b8151811061124757634e487b7160e01b600052603260045260246000fd5b602002602001015191509150826103e56112619190611a9b565b61126d836103e8611a9b565b6112779190611a63565b82611284886103e8611a9b565b61128e9190611a9b565b6112989190611a7b565b95506112a6836103e5611a9b565b6112b2836103e8611a9b565b6112bc9190611a63565b816112c9856103e5611a9b565b6112d39190611a9b565b6112dd9190611a7b565b94505050506002816112ef9190611a63565b90506111e2565b508082111561130857600092506113a3565b6113128183611a9b565b61131e906103e5611a9b565b61132a906103e8611a9b565b92506000600261133b856001611a63565b6113459190611a7b565b9050835b8082101561137b5750806002816113608188611a7b565b61136a9190611a63565b6113749190611a7b565b9150611349565b6103e561138a856103e8611a9b565b6113949083611ad8565b61139e9190611a7b565b945050505b5050919050565b60008215806113ce575081836113c08282611a9b565b92506113cc9083611a7b565b145b610cc557600080fd5b6000826113e48382611a63565b9150811015610cc557600080fd5b6040518061040001604052806020905b6040805180820190915260008152606060208201528152602001906001900390816114025790505090565b82805461143990611b1f565b90600052602060002090601f01602090048101928261145b57600085556114a1565b82601f1061147457805160ff19168380011785556114a1565b828001600101855582156114a1579182015b828111156114a1578251825591602001919060010190611486565b506114ad9291506114b1565b5090565b5b808211156114ad57600081556001016114b2565b600082601f8301126114d6578081fd5b813560206114eb6114e683611a3f565b6119f0565b80838252828201915082860187848660051b890101111561150a578586fd5b855b8581101561153157813561151f81611bbf565b8452928401929084019060010161150c565b5090979650505050505050565b80516dffffffffffffffffffffffffffff8116811461155c57600080fd5b919050565b600060208284031215611572578081fd5b813561157d81611bbf565b9392505050565b600060208284031215611595578081fd5b815161157d81611bbf565b6000806000806000608086880312156115b7578081fd5b85356115c281611bbf565b94506020860135935060408601359250606086013567ffffffffffffffff808211156115ec578283fd5b818801915088601f8301126115ff578283fd5b81358181111561160d578384fd5b89602082850101111561161e578384fd5b9699959850939650602001949392505050565b60008060008060808587031215611646578384fd5b843567ffffffffffffffff8082111561165d578586fd5b818701915087601f830112611670578586fd5b813560206116806114e683611a3f565b8083825282820191508286018c848660051b890101111561169f578a8bfd5b8a96505b848710156116c15780358352600196909601959183019183016116a3565b5098505088013595505060408701359150808211156116de578384fd5b506116eb878288016114c6565b949793965093946060013593505050565b600080600060608486031215611710578283fd5b6117198461153e565b92506117276020850161153e565b9150604084015163ffffffff8116811461173f578182fd5b809150509250925092565b60006020828403121561175b578081fd5b5051919050565b60008060008060608587031215611777578384fd5b84359350602085013567ffffffffffffffff80821115611795578485fd5b818701915087601f8301126117a8578485fd5b8135818111156117b6578586fd5b8860208260051b85010111156117ca578586fd5b60208301955080945050505060408501356117e481611bbf565b939692955090935050565b60008151808452611807816020860160208601611aef565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6000825161184b818460208701611aef565b9190910192915050565b6080808252865190820181905260009060209060a0840190828a01845b8281101561188e57815184529284019290840190600101611872565b505050838201889052838103604085015285815286908201835b878110156118e35782356118bb81611bbf565b73ffffffffffffffffffffffffffffffffffffffff16825291830191908301906001016118a8565b508093505050508260608301529695505050505050565b60208152600061157d60208301846117ef565b828152604060208083018290526000919061044084019084830186855b8381101561199d578785037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc00183528151805173ffffffffffffffffffffffffffffffffffffffff16865284015184860187905261198a878701826117ef565b955050918301919083019060010161192a565b509298975050505050505050565b84815283602082015273ffffffffffffffffffffffffffffffffffffffff831660408201526080606082015260006119e660808301846117ef565b9695505050505050565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715611a3757611a37611ba9565b604052919050565b600067ffffffffffffffff821115611a5957611a59611ba9565b5060051b60200190565b60008219821115611a7657611a76611b93565b500190565b600082611a9657634e487b7160e01b81526012600452602481fd5b500490565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611ad357611ad3611b93565b500290565b600082821015611aea57611aea611b93565b500390565b60005b83811015611b0a578181015183820152602001611af2565b83811115611b19576000848401525b50505050565b600181811c90821680611b3357607f821691505b60208210811415611b5457634e487b7160e01b600052602260045260246000fd5b50919050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611b8c57611b8c611b93565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b73ffffffffffffffffffffffffffffffffffffffff81168114611be157600080fd5b5056fea2646970667358221220190cf1a2e839f55c6afd36a913cea211a34a4b49156801ce89394046c64cf13864736f6c63430008040033";

export class TraderSimulate__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TraderSimulate> {
    return super.deploy(overrides || {}) as Promise<TraderSimulate>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TraderSimulate {
    return super.attach(address) as TraderSimulate;
  }
  connect(signer: Signer): TraderSimulate__factory {
    return super.connect(signer) as TraderSimulate__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TraderSimulateInterface {
    return new utils.Interface(_abi) as TraderSimulateInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TraderSimulate {
    return new Contract(address, _abi, signerOrProvider) as TraderSimulate;
  }
}
