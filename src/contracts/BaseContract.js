/**
 * @license
 * SKALE skale-js
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
 * @file BaseContract.js
 * @date 2019
 */

/** Class representing a basecontract. */
class BaseContract {

    /**
   * Create a basecontract.
   * @param {Object[]} w3 - object of Web3.
   * @param {string} contractAbi - abi of contract.
   * @param {string} contractAddress - address of contract.
   */
    constructor(w3, contractAbi, contractAddress) {
        w3.checkWeb3();
        this.contractAddress = contractAddress;
        this.web3contract = new w3.web3.eth.Contract(contractAbi, contractAddress);
        this.w3 = w3;
        this.events = this.web3contract.events;
    }

}

module.exports = BaseContract;

