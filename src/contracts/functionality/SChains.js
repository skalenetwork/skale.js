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
 * @file SChains.js
 * @date 2019
 */

const BaseContract = require('../BaseContract');
const Helper = require('../../common/Helper');/** * Class representing a schainscontract. * @extends BaseContract */
class SChainsContract extends BaseContract {

    /**
     * Return price in Wei of SKALE chain
     *
     * @function getSchainPrice
     *
     * @param {Object[]} params - just name of object in params.
     * @param {number} params[].indexOfType - type of SKALE chain.
     * @param {number} params[].lifetime - lifetime of SKALE chain in seconds
     * @returns {number} - return price in wei for SKALE chain
     */
    async getSchainPrice(params) {
        let requiredFields = ['indexOfType', 'lifetime'];
        Helper.checkRequiredFields(params, requiredFields);
        return await this.web3contract.methods.getSchainPrice(params.indexOfType, params.lifetime).call();
    }

}

module.exports = SChainsContract;

