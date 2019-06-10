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
 * @file AbstractMethod.js
 * @date 2019
 */

/**
 * Return string
 *
 * @function AbstractMethodException
 *
 * @param {string} name - name of method.
 * @returns {string} return message with info
 */
module.exports = function AbstractMethodException(name) {
    this.name = name;
    this.message = 'Method should be implemented';
    this.toString = function () {
        return this.message + ' ' + this.name;
    };
};
