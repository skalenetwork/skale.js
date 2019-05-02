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
 * @file Rand.js
 * @date 2019
 */

class Rand {

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     *
     * @function integer
     *
     * @param {number} min - min value.
     * @param {number} max - max value.
     * @returns {number} - Return random integer.
     */
    static integer(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Returns random string
     *
     * @function randomString
     *
     * @param {number} length - length of random string.
     * @returns {string} - Return random string.
     */
    static randomString(length) {
        return Math.random().toString(36).substring(length);
    }

}

module.exports = Rand;
