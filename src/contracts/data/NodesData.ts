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
 * @file NodesData.js
 * @date 2019
 */

const BaseContract = require('../BaseContract');
const Helper = require('../../common/Helper');
const FIELDS = [
    'name',
    'ip',
    'publicIP',
    'port',
    'publicKey',
    'start_date',
    'leaving_date',
    'last_reward_date',
    'second_address'
];/** * Class representing a nodesdata. * @extends BaseContract */
class NodesData extends BaseContract {

    /**
     * Return node info by `nodeID`
     *
     * @function getNodeRaw
     *
     * @param {string} nodeID - The id of node.
     * @returns {Object[]} object with node `native` fields
     */
    async getNodeRaw(nodeID) {
        return this.web3contract.methods.nodes(nodeID).call();
    }

    /**
     * Return node info by `nodeID`
     *
     * @function getNode
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].nodeID - number of node.
     * @returns {Object[]} object with node custom fields
     */
    async getNode(params) {
        let requiredFields = ['nodeID'];
        Helper.checkRequiredFields(params, requiredFields);
        let nodeArr = await this.getNodeRaw(params.nodeID);
        return Helper.format(FIELDS, nodeArr);
    }

    /**
     * Return array of IPs for all active nodes
     *
     * @function getActiveNodeIPs
     *
     * @returns {Array} return array of strings for all active nodes (['0x..', '0x'...])
     */
    getActiveNodeIPs() {
        return this.web3contract.methods.getActiveNodeIPs().call();
    }

    /**
     * Return nodes by IDs
     *
     * @function getNodesByIDs
     *
     * @param {Array} nodeIDs - The array of strings
     * @returns {Array} return array of objects (nodes)
     */
    async getNodesByIDs(nodeIDs) {
        let nodes = [];
        for (let nodeID of nodeIDs) {
            let node = await this.getNode({nodeID: nodeID});
            node['id'] = nodeID;

            nodes.push(node);
        }
        return nodes;
    }

    /**
     * Return all active nodes for your account
     *
     * @function getActiveNodesForSender
     *
     * @returns {Array} return array of objects (nodes)
     */
    async getActiveNodesForSender() {
        let nodeIDs = await this.getActiveNodeIDsForSender();
        return await this.getNodesByIDs(nodeIDs);
    }

    /**
     * Return all active nodes
     *
     * @function getActiveNodes
     *
     * @returns {Array} return array of objects (nodes)
     */
    async getActiveNodes() {
        let nodeIDs = await this.getActiveNodeIDs();
        return await this.getNodesByIDs(nodeIDs);
    }

    /**
     * Return array of IDs for all active nodes
     *
     * @function getActiveNodeIDs
     *
     * @returns {Array} return array of strings for all active nodes (like ['30'])
     */
    async getActiveNodeIDs() {
        return await this.web3contract.methods.getActiveNodeIds().call();
    }

    /**
     * Return all IDs for active nodes by your account
     *
     * @function getActiveNodeIDsForSender
     *
     * @returns {Array} return array of string
     */
    async getActiveNodeIDsForSender() {
        return await this.web3contract.methods.getActiveNodesByAddress().call();
    }

    /**
     * Return node ID by name
     *
     * @function nodeNameToId
     *
     * @param {string} name - name of node.
     * @returns {string} return node id (like (`0x...`))
     */
    nodeNameToId(name) {
        return this.w3.web3.utils.sha3(name);
    }

    /**
     * Return true or false for node check name when created
     *
     * @function isNodeNameAvailable
     *
     * @param {string} name - name of node.
     * @returns {boolean} - returns true if node name is available.
     */
    async isNodeNameAvailable(name) {
        let nodeId = this.nodeNameToId(name);
        // add '!' before await, because nodeNameCheck method was returned 'false' when name is available
        // with '!' return 'true'
        return !await this.web3contract.methods.nodesNameCheck(nodeId).call();
    }

    /**
     * Return date in seconds, which tell when node need to get bounty
     *
     * @function getNodeNextRewardDate
     *
     * @param {Object[]} params - just name of object in params.
     * @param {number} params[].nodeIndex - node index in array
     * @returns {number} - Return date in seconds
     */
    async getNodeNextRewardDate(params) {
        let requiredFields = ['nodeIndex'];
        Helper.checkRequiredFields(params, requiredFields);
        return this.web3contract.methods.getNodeNextRewardDate(params.nodeIndex).call();
    }

}

export = NodesData;
