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
 * @file Nodes.js
 * @date 2019
 */

const BaseContract = require('../BaseContract');
class NodesContract extends BaseContract {

    /**
   * Return node ID by name
   *
   * @function nodeNameToId
   *
   * @param {string} name - name of node.
   * @returns {string} return node id
   */
    nodeNameToId(name) {
        return this.w3.web3.utils.sha3(name);
    }

}

module.exports = NodesContract;

