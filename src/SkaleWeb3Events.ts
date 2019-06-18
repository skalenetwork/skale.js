/**
 * @license
 * SKALE skale.js
 * Copyright (C) 2019-Present SKALE Labs
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file SkaleWeb3Events.js
 * @date 2019
 */

import Web3 = require('web3');

import BaseContract = require('./contracts/BaseContract');
import ContractManager = require('./contracts/ContractManager');
import Manager = require('./contracts/Manager');
import TokenContract = require('./contracts/TokenContract');
import Constants = require('./contracts/Constants');

import NodesContract = require('./contracts/functionality/Nodes');
import SChainsContract = require('./contracts/functionality/SChains');
import ValidatorsContract = require('./contracts/functionality/Validators');

import NodesData = require('./contracts/data/NodesData');
import SChainsData = require('./contracts/data/SChainsData');
import ValidatorsData = require('./contracts/data/ValidatorsData');

import NoWeb3ProvidedException = require('./exceptions/NoWeb3Provided');
import NoContractFoundException = require('./exceptions/NoContractFound');
import Helper = require('./common/Helper');

const jsonData = require('../contracts_data/main.json');

const contractTypes = {
    'API': 1,
    'DATA': 2,
    'INTERNAL': 3
};

const contractsMetadata = {
    'contract_manager': {
        'name': 'ContractManager',
        'class': ContractManager,
        'type': contractTypes.API,
        'upgradable': false
    },
    'token': {
        'name': 'SkaleToken',
        'class': TokenContract,
        'type': contractTypes.API,
        'upgradable': false
    },
    'manager': {
        'name': 'SkaleManager',
        'class': Manager,
        'type': contractTypes.API,
        'upgradable': true
    },
    'constants': {
        'name': 'Constants',
        'class': Constants,
        'type': contractTypes.INTERNAL,
        'upgradable': true
    },
    'nodes_functionality': {
        'name': 'NodesFunctionality',
        'class': NodesContract,
        'type': contractTypes.API,
        'upgradable': true
    },
    'schains_functionality': {
        'name': 'SchainsFunctionality',
        'class': SChainsContract,
        'type': contractTypes.API,
        'upgradable': true
    },
    'validators_functionality': {
        'name': 'ValidatorsFunctionality',
        'class': ValidatorsContract,
        'type': contractTypes.API,
        'upgradable': true
    },
    'nodes_data': {
        'name': 'NodesData',
        'class': NodesData,
        'type': contractTypes.API,
        'upgradable': true
    },
    'schains_data': {
        'name': 'SchainsData',
        'class': SChainsData,
        'type': contractTypes.API,
        'upgradable': true
    },
    'validators_data': {
        'name': 'ValidatorsData',
        'class': ValidatorsData,
        'type': contractTypes.API,
        'upgradable': true
    }
};

const SkaleWeb3 = {

    contracts: {},

    checkWeb3() {
        if (this.web3 === undefined) {
            throw new NoWeb3ProvidedException();
        }
        return true;
    },

    setWeb3(web3Provider, abiData) {
        this.abiData = abiData || jsonData;
        this.web3 = new Web3(web3Provider);
    },

    initWeb3(wsAddr, abiData) {
        const web3SocketProvider = new Web3.providers.WebsocketProvider(wsAddr);
        this.setWeb3(web3SocketProvider, abiData);
    },

    addContract(contract, contractName) {
        this.checkWeb3();
        this.contracts[contractName] = contract;
    },

    initBaseContract(abi, contractAddress, name) {
        let contract = new BaseContract(this, abi, contractAddress);
        this.addContract(contract, name);
    },

    initLibContract(name, ContractClass, address) {
        let abi = this.abiData[
            `skale_${name}_abi`] ||
            this.abiData[`${name}_abi`] ||
            this.abiData[`${name}_functionality_abi`] ||
            this.abiData[`${name}_data_abi`
            ];
        let contractAddress = address || this.abiData[`skale_${name}_address`] || this.abiData[`${name}_address`];
        let contract = new ContractClass(this, abi, contractAddress);
        this.addContract(contract, name);
    },

    async getContractAddress(name) {
        let contractManager = this.contracts['contract_manager'];
        return await contractManager.getContractAddress({name: name});
    },

    async initUpgradableLibContract(contractName, contractMeta) {
        let address = await this.getContractAddress(contractMeta.name);
        this.initLibContract(contractName, contractMeta.class, address);
    },

    async initAllContracts() {
        this.initLibContract('contract_manager', ContractManager);

        for (let contractName in contractsMetadata) {
            let contractMeta = contractsMetadata[contractName];
            if (contractMeta.upgradable) {
                await this.initUpgradableLibContract(contractName, contractMeta);
            } else {
                this.initLibContract(contractName, contractMeta.class);
            }
        }
    },

    getContractByName(contractName) {
        let contract = this.contracts[contractName];
        if (contract === undefined) {
            throw new NoContractFoundException(contractName);
        }
        return contract;
    },

    closeConnection() {
        this.web3.currentProvider.connection.close();
    },

    getAccounts() {
        return this.web3.eth.getAccounts();
    },

    async selectAccount(account) {
        if (account) return account;
        let accounts = await this.web3.eth.getAccounts();
        return accounts[0];
    },

    // for dev only
    createAccount() {
        return this.web3.eth.accounts.create();
    },

    unlockAccount(account, time, password) {
        return this.web3.eth.personal.unlockAccount(account, password, time);
    },

    async createAndUnlock(time, password) {
        let account = await this.createAccount();
        await this.web3.eth.personal.importRawKey(Helper.rmBytesSymbol(account.privateKey), password);
        await this.web3.eth.personal.unlockAccount(account.address, password, time);
        return account;
    },

    allEventsOpt() {
        return {fromBlock: 0, toBlock: 'latest'};
    }

};
export = SkaleWeb3;
