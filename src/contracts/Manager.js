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
 * @file Manager.js
 * @date 2019
 */

const BaseContract = require('./BaseContract');
const Helper = require('../common/Helper');

const operationTypes = {
    createNode: '0x01',
    createSchain: '0x10',
    createAggregationSchain: '0x11'
};

const gasAmount = {
    createNode: 4500000,
    createSchain: 5000000,
    getBounty: 2000000,
    sendVerdict: 200000,
    broadcast: 200000,
    deleteSchain: 2000000
};

const NODE_DEPOSIT = '100000000000000000000';/** * Class representing a manager. * @extends BaseContract */
class Manager extends BaseContract {

    /**
     * Create Node in network and return promise
     *
     * @function createNode
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].ip - IP of node.
     * @param {string} params[].port - port of node.
     * @param {string} params[].name - name of node.
     * @returns {Object[]} return promise
     */
    async createNode(params) {
        let requiredFields = ['ip', 'port', 'name'];
        let account = await this.w3.selectAccount(params.account);
        Helper.checkRequiredFields(params, requiredFields);

        try {
            Helper.validateIPaddress(params.ip);
        } catch (e) {
            console.log(e.toString());
            return {promise: Promise.resolve(false)};
        }

        let pubIp = params.pubIp ? params.pubIp : params.ip;
        let nonce = Helper.generateNonce();
        let pubKey = Helper.privateKeyToPublic(params.privateKey);
        let bytesData = this.createNodeDataToBytes(
            params.port,
            nonce,
            params.ip,
            pubIp,
            params.name,
            pubKey);
        let tokenContract = this.w3.getContractByName('token');
        let web3TokenContract = tokenContract.web3contract;
        let promise = '';
        console.log('bytesData: ', bytesData);
        // for invoke from script
        if (params.privateKey) {
            let encoded = web3TokenContract.methods.transfer(this.contractAddress, NODE_DEPOSIT, bytesData).encodeABI();
            let account = params.account;
            let tx = {
                from: account,
                gasPrice: 0,
                gasLimit: 8000000,
                to: tokenContract.contractAddress,
                data: encoded,
                gas: gasAmount.createNode
            };
            let privateKey = params.privateKey;
            let signedTx = await this.w3.web3.eth.accounts.signTransaction(tx, privateKey);
            promise = this.w3.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        } else {
            // for invoke from DappUI
            promise = web3TokenContract.methods.transfer(this.contractAddress, NODE_DEPOSIT, bytesData).send({
                from: account,
                gas: gasAmount.createNode
            });
        }

        return {promise: promise, nonce: nonce};
    }

    /**
     * Create SKALE chain in network and return promise
     *
     * @function createSchain
     *
     * @param {Object[]} params - just name of object in params.
     * @param {number} params[].lifetime - lifetime in seconds.
     * @param {number} params[].typeOfNodes - type of SKALE chain.
     * @param {string} params[].deposit - deposit of SKALE chain in Wei.
     * @param {string} params[].name - name of SKALE chain.
     * @returns {Object[]} return promise
     */
    async createSchain(params) {
        let requiredFields = ['lifetime', 'typeOfNodes', 'deposit', 'name'];
        let account = await this.w3.selectAccount(params.account);
        Helper.checkRequiredFields(params, requiredFields);

        let nonce = Helper.generateNonce();
        let bytesData = this.createSchainDataToBytes(
            'createSchain',
            params.lifetime,
            params.typeOfNodes,
            nonce,
            params.name);
        let tokenContract = this.w3.getContractByName('token');
        let web3TokenContract = tokenContract.web3contract;
        let promise = ''; // for invoking from script
        if (params.privateKey) {
            let encoded = web3TokenContract.methods.transfer(
                this.contractAddress,
                params.deposit,
                bytesData
            ).encodeABI();
            let account = params.account;
            let tx = {
                from: account,
                gasPrice: 0,
                gasLimit: 8000000,
                to: tokenContract.contractAddress,
                data: encoded,
                gas: gasAmount.createNode
            };
            let privateKey = params.privateKey;
            let signedTx = await this.w3.web3.eth.accounts.signTransaction(tx, privateKey);
            promise = this.w3.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        } else {
            // for invoking from DappUI
            promise = web3TokenContract.methods.transfer(this.contractAddress, params.deposit, bytesData).send({
                from: account,
                gas: gasAmount.createSchain
            });
        }

        return {promise: promise, nonce: nonce};
    }

    /**
     * Convert Node parameters to bytes string
     *
     * @function createNodeDataToBytes
     *
     * @param {string} port - port of Node.
     * @param {number} nonce - random numbers from `1` to `65534`.
     * @param {string} ip - ip of Node.
     * @param {string} pubIp - public IP of Node.
     * @param {string} name - name of Node.
     * @param {string} pubKey - public key.
     * @returns {string} return bytes string ('0x...')
     */
    createNodeDataToBytes(port, nonce, ip, pubIp, name, pubKey) {
    // helpers
        let web3 = this.w3.web3;
        let ipHex = Helper.ipStringToBytes(ip);
        let portHex = Helper.addZeroesToByte(web3.utils.numberToHex(port), 2);
        let nonceHex = web3.utils.numberToHex(nonce);
        let nameHex = web3.utils.toHex(name);
        let pubIpHex = Helper.ipStringToBytes(pubIp);
        // let pubKeyHex = web3.utils.toHex(pubKey);

        console.log('ip', ipHex);
        console.log('port', portHex);
        console.log('nonce', nonceHex);
        console.log('name', nameHex);
        console.log('pubIp', pubIpHex);

        return Helper.addByteStrings([operationTypes.createNode, portHex, nonceHex, ipHex, pubIpHex, pubKey, nameHex ]);
    }

    /**
     * Convert SKALE chain parameters to bytes string
     *
     * @function createSchainDataToBytes
     *
     * @param {string} operationName - name of operation for `operationTypes` constant.
     * @param {number} lifetime - lifetime in seconds.
     * @param {number} typeOfNodes - type of SKALE chain.
     * @param {number} nonce - random number.
     * @param {string} name - name of SKALE chain.
     * @returns {string} return bytes string ('0x...')
     */
    createSchainDataToBytes(operationName, lifetime, typeOfNodes, nonce, name) {
        let web3 = this.w3.web3;
        let lifetimeHex = Helper.addZeroesToByte(web3.utils.toHex(lifetime), 32);
        let typeOfNodesHex = Helper.addZeroesToByte(web3.utils.toHex(typeOfNodes), 1);
        let nonceHex = Helper.addZeroesToByte(web3.utils.toHex(nonce), 2);
        let nameHex = web3.utils.toHex(name);
        let operationHex = operationTypes[operationName];
        return Helper.addByteStrings(
            [operationHex, lifetimeHex, typeOfNodesHex, nonceHex, nameHex]
        );
    }

    /**
     * delete SKALE chain from contract
     *
     * @function deleteSchain
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].name - name of SKALE chain.
     * @returns {Object[]} return promise
     */
    async deleteSchain(params) {
        let requiredFields = ['name'];
        let account = await this.w3.selectAccount(params.account);
        Helper.checkRequiredFields(params, requiredFields);

        let promise = ''; // for invoke from script
        if (params.privateKey) {
            console.log('inside delete schain form test or script');
            let encoded = this.web3contract.methods.deleteSchain(params.name).encodeABI();
            let account = params.account;
            let tx = {
                from: account,
                gasPrice: 0,
                to: this.contractAddress,
                data: encoded,
                gas: gasAmount.deleteSchain
            };
            let privateKey = params.privateKey;
            let signedTx = await this.w3.web3.eth.accounts.signTransaction(tx, privateKey);
            promise = this.w3.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        } else {
            // for invoke from DappUI
            promise = this.web3contract.methods.deleteSchain(params.name)
                .send({
                    from: account,
                    gas: gasAmount.deleteSchain
                });
        }
        return {promise: promise};

    }

}

module.exports = Manager;

