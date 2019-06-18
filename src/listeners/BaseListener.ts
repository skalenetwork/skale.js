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
 * @file BaseListener.js
 * @date 2019
 */

const AbstractMethodException = require('../exceptions/AbstractMethod');
/** * Class representing a BaseListener. */
class BaseListener {

    /**
     * Create a baselistener.
     *
     * @param {Object[]} event - Web3 event.
     * @param {Function} handler - invoke when event is coming.
     */
    constructor(event, handler) {
        (this as any).subscription = event;
        (this as any).subscription.on('data', handler).on('error', this.errorCallback);
        (this as any).active = true;
    }

    eventCallback() {
        throw new AbstractMethodException();
    }

    errorCallback(err) {
        if (err) {
            console.log(err);
        }
    }

    turnOff() {
        let self = (this as any);
        (this as any).subscription.unsubscribe(function (error, success) {
            if (success) {
                self.active = false;
            }
        });
    }

    isActive() {
        return (this as any).active;
    }
}

export = BaseListener;

