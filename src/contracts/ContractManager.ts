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
 * @file ContractManager.js
 * @date 2019
 */

const BaseContract = require('./BaseContract');
const Helper = require('../common/Helper');
class ContractManager extends BaseContract {

    /**
     * Return contract address
     *
     * @function getContractAddress
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].name - contract name.
     * @returns {string} - Return contract address
     */
    async getContractAddress(params) {
        let requiredFields = ['name'];
        Helper.checkRequiredFields(params, requiredFields);
        let contractHash = this.getContractHashByName(params.name);
        return this.web3contract.methods.contracts(contractHash).call();
    }

    /**
     * Return contract hash
     *
     * @function getContractHashByName
     *
     * @param {string} name - contract name.
     * @returns {string} - Return contract hash
     */
    getContractHashByName(name) {
        return this.w3.web3.utils.sha3(name);
    }

}

export = ContractManager;

