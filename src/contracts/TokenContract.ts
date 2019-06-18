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
 * @file TokenContract.js
 * @date 2019
 */

const BaseContract = require('./BaseContract');
const Helper = require('../common/Helper');

const gasAmount = {
    transfer: 80000
};
class TokenContract extends BaseContract {

    /**
     * Get balance for account
     *
     * @function balanceOf
     *
     * @param {string} account - account address.
     * @returns {Object} - Return promise object
     */
    async balanceOf(account) {
        return await this.web3contract.methods.balanceOf(account).call();
    }

    /**
     * Transfer SKL from one to another account
     *
     * @function transfer
     *
     * @param {Object[]} params - just name of object in params.
     * @param {string} params[].from - donor account address.
     * @param {string} params[].to - recipient account address.
     * @param {string} params[].amount - amount of SKL-tokens in wei.
     * @returns {Object} - Return promise object
     */
    async transfer(params) {
        let requiredFields = ['from', 'to', 'amount'];
        Helper.checkRequiredFields(params, requiredFields);

        let promise = ''; // for invoking from script
        if (params.privateKey) {
            let encoded = this.web3contract.methods.transfer(params.to, params.amount).encodeABI();
            let account = params.from;
            let tx = {
                from: account,
                gasPrice: 0,
                to: this.contractAddress,
                data: encoded,
                gas: gasAmount.transfer
            };
            let privateKey = params.privateKey;
            let signedTx = await this.w3.web3.eth.accounts.signTransaction(tx, privateKey);
            promise = this.w3.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        } else {
            // for invoking from DappUI
            promise = this.web3contract.methods.transfer(params.to, params.amount).send({
                from: params.from,
                gas: gasAmount.transfer
            });
        }
        return promise;
    }

    /**
     * Transfer history for account
     *
     * @function getTransferHistory
     *
     * @param {string} account - account address.
     * @returns {Object} - from and to object of transfer history
     */
    async getTransferHistory(account) {
        let from = await
        this.web3contract.getPastEvents('Transfer', {
            filter: {_from: account},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {
            if (error) console.error(error);
        });
        let to = await
        this.web3contract.getPastEvents('Transfer', {
            filter: {_to: account},
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {
            if (error) console.error(error);
        });
        return {from: from, to: to};
    }

}

export = TokenContract;

