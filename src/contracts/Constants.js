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
 * @file Constants.js
 * @date 2019
 */

const BaseContract = require('./BaseContract');
/* const Helper = require('../common/Helper');

const gasAmount = {
    setPeriods: 100000
};*/

/**
 * Class representing a Constants.
 * @extends BaseContract
 */
class Constants extends BaseContract {

    /*    /!**
   * Return date in seconds, which tell when node need to get bounty
   *
   * @function setPeriods
   *
   * @param {Object[]} params - just name of object in params.
   * @param {number} params[].nodeIndex - node index in array
   * @returns {number} - Return date in seconds
   *!/
    async setPeriods(params) {
        let requiredFields = ['newRewardPeriod', 'newDeltaPeriod', 'account'];

        Helper.checkRequiredFields(params, requiredFields);

        return this.web3contract.methods.setPeriods(params.newRewardPeriod, params.newDeltaPeriod).send({
            from: params.account,
            gas: gasAmount.setPeriods
        });
    }

    /!**
   * Return date in seconds, which tell when node need to get bounty
   *
   * @function getPeriods
   *
   * @param {Object[]} params - just name of object in params.
   * @param {number} params[].nodeIndex - node index in array
   * @returns {number} - Return date in seconds
   *!/
    async getPeriods(params) {
        let requiredFields = ['account'];

        Helper.checkRequiredFields(params, requiredFields);
        let rewardPeiod = this.web3contract.methods.rewardPeriod().call();

        let deltaPeriod = this.web3contract.methods.deltaPeriod().call();

        return {rewardPeiod: rewardPeiod, deltaPeriod: deltaPeriod};
    }*/

}

module.exports = Constants;

