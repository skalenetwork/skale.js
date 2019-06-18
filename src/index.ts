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
 * @file index.js
 * @date 2019
 */

import SkaleWeb3 = require('./SkaleWeb3');
import SkaleWeb3Events = require('./SkaleWeb3Events'); // this is temporary
import Helper = require('./common/Helper');
import Rand = require('./common/Rand');
import BaseListener = require('./listeners/BaseListener');

let SkaleJs = {

    /**
     * Initialization of skale.js library with WS address
     *
     * @param {string} ip - IPv4 address of SKALE node
     * @param {number} wsPort - WS port of SKALE node
     * @param {Object} abiData - JSON object containing SKALE contract ABIs and addresses
     */
    async init(ip, wsPort, abiData) {
        let wsAddr = Helper.generateWsAddr(ip, wsPort);
        SkaleWeb3.initWeb3(wsAddr, abiData);
        await SkaleWeb3.initAllContracts();
    },

    async initWithProvider(web3Provider, abiData) {
        SkaleWeb3.setWeb3(web3Provider, abiData);
        await SkaleWeb3.initAllContracts();
    },

    async initBothProviders(ip, wsPort, web3Provider, abiData) {
        SkaleWeb3.setWeb3(web3Provider, abiData);
        await SkaleWeb3.initAllContracts();

        let wsAddr = Helper.generateWsAddr(ip, wsPort);
        SkaleWeb3Events.initWeb3(wsAddr, abiData);
        await SkaleWeb3Events.initAllContracts();
    },

    contract(name) {
        return SkaleWeb3.getContractByName(name);
    },

    contractEv(name) {
        return SkaleWeb3Events.getContractByName(name);
    }

};
(SkaleJs as any).w3 = SkaleWeb3;
(SkaleJs as any).w3events = SkaleWeb3Events; // this is temporary
(SkaleJs as any).helper = Helper;
(SkaleJs as any).rand = Rand;
(SkaleJs as any).Listener = BaseListener;
export = SkaleJs;

