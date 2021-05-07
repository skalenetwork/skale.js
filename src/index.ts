import Web3 from 'web3';


class Skale {
    readonly web3: Web3;
    contracts: Array<number>;
  
    constructor(web3: Web3, abis: any) {
      this.web3 = web3;
      this.contracts = [1, 2 , 3];
    }
  
    async getBlock() {
        return await this.web3.eth.getBlockNumber();
    }

    initContracts() {
        let managerABIs = require("./contracts/manager.json");
        this.initContractManager(managerABIs);
    }

    initContractManager(managerABIs: any) {
        let cmAbi = managerABIs['contract_manager_abi'];
        let cmAddress = managerABIs['contract_manager_address'];

        console.log(cmAbi);
        console.log(cmAddress);
    }


}

export default Skale;
