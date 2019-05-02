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
 * @file SChainsData.js
 * @date 2019
 */

const BaseContract = require('../BaseContract');
const Helper = require('../../common/Helper');
const NUMBER_OF_PORTS = 3;
const PORTS_PER_SCHAIN = 11;
const FIELDS = [
    'name',
    'owner',
    'indexInOwnerList',
    'partOfNode',
    'lifetime',
    'startDate',
    'deposit'
];/** * Class representing a schainsdata. * @extends BaseContract */
class SChainsData extends BaseContract {

    /**
     * Return SKALE chain by `id`
     *
     * @function getSchain
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].id - The id of SKALE chain.
     * @returns {Object[]} object with SKALE chain data
     */
    async getSchain(params) {
        let requiredFields = ['id'];
        Helper.checkRequiredFields(params, requiredFields);
        let SchainArr = await this.web3contract.methods.schains(params['id']).call();
        return Helper.format(FIELDS, SchainArr);
    }

    /**
     * Return array of SKALE chains ids which `nodeID`
     *
     * @function getSchainIdsForNode
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].nodeID - The id of Node.
     * @returns {Array} SKALE chains ids like strings (example: ['1', '2'] not [1, 2])
     */
    async getSchainIdsForNode(params) {
        let requiredFields = ['nodeID'];
        Helper.checkRequiredFields(params, requiredFields);
        return await this.web3contract.methods.getSchainIdsForNode(params.nodeID).call();
    }

    /**
     * Return name of SKALE chain by `sChainID`
     *
     * @function getSchainNameBySchainId
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].sChainID - The id of SKALE chain.
     * @returns {string} SKALE chain name
     */
    async getSchainNameBySchainId(params) {
        let requiredFields = ['sChainID'];
        Helper.checkRequiredFields(params, requiredFields);
        return await this.web3contract.methods.getSchainNameBySchainId(params.sChainID).call();
    }

    /**
     * Return number of SKALE chains for account
     *
     * @function getSchainNameBySchainId
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].account - account address.
     * @returns {number} number of SKALE chains for this account
     */
    getSchainListSize(params) {
        let requiredFields = ['account'];
        Helper.checkRequiredFields(params, requiredFields);
        return this.web3contract.methods.getSchainListSize(params['account']).call();
    }

    /**
     * Return name of SKALE chain by `index`
     *
     * @function getSchainNameByIndex
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].account - account address.
     * @returns {number} number of SKALE chains for this account
     */
    getSchainNameByIndex(params) {
        let requiredFields = ['index', 'account'];
        Helper.checkRequiredFields(params, requiredFields);
        return this.web3contract.methods.schainIndexes(params['account'], params['index']).call();
    }

    /**
     * Return true or false for SKALE chain check name when created
     *
     * @function isSchainNameAvailable
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].name - name of SKALE chain which user want to create.
     * @returns {boolean} - returns true if SKALE chain is available.
     */
    isSchainNameAvailable(params) {
        let requiredFields = ['name'];
        Helper.checkRequiredFields(params, requiredFields);
        return this.web3contract.methods.isSchainNameAvailable(params.name).call();
    }

    /**
     * Return array of objects (SKALE chains) for account
     *
     * @function getSchainListInfo
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].account - account address.
     * @returns {Array} - Return array of objects
     */
    async getSchainListInfo(params) {
        let requiredFields = ['account'];
        Helper.checkRequiredFields(params, requiredFields);

        let listSize = await this.getSchainListSize({account: params['account']});
        let sChains = [];
        for (let i = 0; i < listSize; i++) {
            let id = await this.getSchainNameByIndex({'index': i, 'account': params['account']});
            let schain = await this.getSchain({'id': id});
            sChains.push(schain);
        }
        return sChains;
    }

    /**
     * Return id of SKALE chain
     *
     * @function sChainNameToId
     *
     * @param {string} name - name of SKALE chain.
     * @returns {number} - Return id of SKALE chain
     */
    sChainNameToId(name) {
        return this.w3.web3.utils.sha3(name);
    }

    /**
     * Returns information about the nodes with rpc ports on which the SKALE chain is located
     *
     * @function getSchainNodes
     *
     * @param {string} name - name of SKALE chain.
     * @returns {Object[]} - which contains array of objects
     * @returns {Array} Object[].schainNodes - Return array of objects.
     */
    async getSchainNodes(name) {
        let schainNodes = await this.getNodesForSchainConfig(name);
        for (let i in schainNodes) {
            let schainNode = schainNodes[i];
            schainNode['basePort'] = await this.getSchainBasePort(name, schainNode['nodeID'], schainNode['basePort']);
            schainNode['rpcPort'] = parseInt(schainNode['basePort'], 10) + NUMBER_OF_PORTS;
        }
        return {schainNodes: schainNodes};
    }

    /**
     * Returns information about the nodes with owner on which the SKALE chain is located
     *
     * @function getNodesForSchainConfig
     *
     * @param {string} name - name of SKALE chain.
     * @returns {Array} - Return array of objects.
     */
    async getNodesForSchainConfig(name) {
        let nodesInfo = [];
        let nodes = await this.getNodesForSchain(name);
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let pk = node['publicKey'];
            let schainIndex = i;
            let nodeID = node['id'];
            let ip = this.ipFromHex(node['ip']);
            let basePort = node['port'];
            let publicKey = pk;
            let publicIP = this.ipFromHex(node['publicIP']);
            let owner = Helper.getAddrFromPubKey(pk);
            nodesInfo.push({
                'schainIndex': schainIndex,
                'nodeID': nodeID,
                'ip': ip,
                'basePort': basePort,
                'publicKey': publicKey,
                'publicIP': publicIP,
                'owner': owner
            });
        }
        return nodesInfo;
    }

    /**
     * Returns information about the nodes with raw fields on which the SKALE chain is located
     *
     * @function getNodesForSchain
     *
     * @param {string} name - name of SKALE chain.
     * @returns {Array} - Return array of objects.
     */
    async getNodesForSchain(name) {
        let nodeIDs = await this.getNodeIdsForSchain(name);
        let NodesDataContract = this.w3.getContractByName('nodes_data');
        return await NodesDataContract.getNodesByIDs(nodeIDs);
    }

    /**
     * Returns array of node ids on which the SKALE chain is located
     *
     * @function getNodeIdsForSchain
     *
     * @param {string} name - name of SKALE chain.
     * @returns {Array} - Return array of strings.
     */
    async getNodeIdsForSchain(name) {
        let NodesDataContract = this.w3.getContractByName('nodes_data');
        let nodeId = NodesDataContract.nodeNameToId(name);
        return await this.web3contract.methods.getNodesInGroup(nodeId).call();
    }

    /**
     * Returns ip (like `2.2.2.2`) from `0x...`
     *
     * @function ipFromHex
     *
     * @param {string} hex - ip in hex.
     * @returns {string} - like `2.2.2.2`
     */
    ipFromHex(hex) {
        let subFirstTwoSymbols = hex.substring(2);
        // split string by 2 symbols

        let arr = subFirstTwoSymbols.match(/.{1,2}/g);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i], 16);
        }

        return arr.join('.');
    }

    /**
     * Returns SKALE chain base port for node on which SKALE chain is located
     *
     * @function getSchainBasePort
     *
     * @param {string} schainName - name of SKALE chain.
     * @param {string} nodeID - id of node on which SKALE chain is located.
     * @param {string} nodePort - port of node on which SKALE chain is located.
     * @returns {string} - return base port of SKALE chain for node (example '17033')
     */
    async getSchainBasePort(schainName, nodeID, nodePort) {
        let nodeSchains = await this.getSchainsForNode(nodeID);
        let schainIndex = this.getSchainIndexInNode(schainName, nodeSchains);
        return this.calcSchainBasePort(nodePort, schainIndex);
    }

    /**
     * Returns SKALE chain index
     *
     * @function getSchainIndexInNode
     *
     * @param {string} schainName - name of SKALE chain.
     * @param {Array} nodeSchains - array of objects (SKALE chains) which is located on this node.
     * @returns {number} - return index of SKALE chain for this node
     */
    getSchainIndexInNode(schainName, nodeSchains) {
        for (let i = 0; i < nodeSchains.length; i++) {
            let schain = nodeSchains[i];
            if (schainName === schain['name']) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Returns SKALE chain base port for node on which SKALE chain is located
     *
     * @function calcSchainBasePort
     *
     * @param {string} nodePort - port of node.
     * @param {string} schainIndex - index for SKALE chain which is located on this node.
     * @returns {number} - return index of SKALE chain for this node
     */
    calcSchainBasePort(nodePort, schainIndex) {
        return parseInt(nodePort, 10) + parseInt(schainIndex, 10) * PORTS_PER_SCHAIN;
    }

    /**
     * Returns array of objects (SKALE chains) for node
     *
     * @function getSchainsForNode
     *
     * @param {string} nodeID - node id.
     * @returns {Array} - return all SKALE chains for this node
     */
    async getSchainsForNode(nodeID) {
        let schains = [];
        let schainIDs = await this.getSchainIdsForNode({'nodeID': nodeID});
        for (let i = 0; i < schainIDs.length; i++) {
            let schainID = schainIDs[i];
            let schain = await this.getSchain({'id': schainID});
            schains.push(schain);
        }

        return schains;
    }

}

module.exports = SChainsData;

