/**
 * @license
 * SKALE skale.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file index.ts
 * @copyright SKALE Labs 2021-Present
 */

import Web3 from 'web3';

import { BaseContract } from "./BaseContract";
import { SchainsInternal } from "./contracts/schainsInternal";

export interface ContractsStringMap { [key: string]: any; }

export default class Skale {
    readonly web3: Web3;
    contracts: ContractsStringMap;

    constructor(web3: Web3, abi: any) {
        this.web3 = web3;
        this.contracts = this.initContracts(abi);
    }

    initContracts(abi: any): ContractsStringMap {
        return {
            'schainsInternal': new SchainsInternal(this.web3, abi.schains_internal_abi, abi.schains_internal_address)
        };
    }
}
