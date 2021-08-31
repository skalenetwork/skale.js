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
 * @file BaseContract.ts
 * @copyright SKALE Labs 2021-Present
 */

import { BaseContract } from "../BaseContract";

export class SchainsInternal extends BaseContract {
    async getSchains() {
        return await this.contract.methods.getSchains().call();
    }

    async getSchainName(sChainHash: string) {
        return await this.contract.methods.getSchainName(sChainHash).call();
    }

    async getSchainsNames(): Promise<string[]> {
        let schainIds = await this.getSchains();
        let sChainNames: string[] = [];
        for (const id of schainIds) {
            let name = await this.contract.methods.getSchainName(id).call();
            sChainNames.push(name);
        }
        return sChainNames;
    }
}
