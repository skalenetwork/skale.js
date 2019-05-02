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
 * @file ValidatorsData.js
 * @date 2019
 */

const BaseContract = require('../BaseContract');
const Helper = require('../../common/Helper');
class ValidatorsData extends BaseContract {

    /**
     * Returns an array of nodes that this node is validating
     *
     * @function getValidatedArray
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].nodeID - ID of node.
     * @param {string} params[].account - account address.
     * @returns {Object} - Return promise object
     */
    async getValidatedArray(params) {
        let requiredFields = ['nodeID', 'account'];
        Helper.checkRequiredFields(params, requiredFields);
        return this.web3contract.methods.getValidatedArray(params.nodeID).call({
            from: params.account
        });
    }

}

module.exports = ValidatorsData;

