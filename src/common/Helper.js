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
 * @file Helper.js
 * @date 2019
 */

const InvalidInputException = require('../exceptions/InvalidInput');
const Rand = require('./Rand');
const Web3 = require('web3');
const web3 = new Web3();
const MissingRequiredParameterException = require('../exceptions/MissingRequiredParameterException');
const ipRegex = new RegExp(['^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
    '.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'].join(''));
const portRange = [0, 65535];
// for pubKey from privatKey
const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');

const Helper = {

    /**
     * add `0` to string
     *
     * @function addZeroesToByte
     *
     * @param {string} str - string (like `0x65sdf`).
     * @param {number} num - number of bytes.
     * @returns {string} - Return string like `0x0..065sdf`
     */
    addZeroesToByte(str, num) {
        // console.log('num: ', num);
        if (str.length > (num * 2 + 1)) {
            return str;
        }

        str = str.slice(2);
        do {
            str = '0' + str;
        } while (str.length < (num * 2));

        return '0x' + str;
    },

    /**
     * Check is string include `0x` in begin
     *
     * @function ensureStartsWith0x
     *
     * @param {string} str - string (like `0x65sdf`).
     * @returns {boolean} - return `true` or `false`
     */
    ensureStartsWith0x(str) {
        if (str.length < 2) {
            return false;
        }
        return (str[0] === '0' && str[1] === 'x');
    },

    /**
     * Add `0x` to string
     *
     * @function addBytesSymbol
     *
     * @param {string} str - string (like `65sdf`).
     * @returns {string} - return string (like `0x65sdf`).
     */
    addBytesSymbol(str) {
        if (this.ensureStartsWith0x(str)) return str;
        return '0x' + str;
    },

    /**
     * Erase `0x` from string
     *
     * @function rmBytesSymbol
     *
     * @param {string} str - string (like `0x65sdf`).
     * @returns {string} - return string (like `65sdf`).
     */
    rmBytesSymbol(str) {
        if (!this.ensureStartsWith0x(str)) return str;
        return str.slice(2);
    },

    /**
     * Return object with custom fields
     *
     * @function format
     *
     * @param {array} fields - array of strings with custom field names.
     * @param {array} array - array with raw rows.
     * @returns {object} - return object.
     */
    format(fields, array) {
        let object = {};
        for (let [index, val] of fields.entries()) {
            object[val] = array[index];
        }
        return object;
    },

    /**
     * Generate random number from 1 to 65534
     *
     * @function generateNonce
     *
     * @returns {number} - return number.
     */
    generateNonce() {
        return Rand.integer(1, 65534);
    },

    /**
     * Set timeout in milliseconds
     *
     * @function timeout
     *
     * @param {number} ms - milliseconds.
     * @returns {object} - return promise.
     */
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Return web socket endpoint
     *
     * @function generateWsAddr
     *
     * @param {string} ip - array of strings with custom field names.
     * @param {string} wsPort - array with raw rows.
     * @returns {string} - return web socket endpoint.
     */
    generateWsAddr(ip, wsPort) {
        if (!this.validateIPaddress(ip)) {
            throw new InvalidInputException('IP address ' + ip + ' does not match the following regex: ' + ipRegex);
        }
        if (!this.checkPort(wsPort)) {
            throw new InvalidInputException('Port ' + wsPort + ' is out of range: ' + portRange);
        }
        return 'ws://' + ip + ':' + wsPort;
    },

    /**
     * Check IP validate
     *
     * @function validateIPaddress
     *
     * @param {string} ipAddress - ip address string.
     * @returns {boolean} - return true or return exception.
     */
    validateIPaddress(ipAddress) {
        if (ipRegex.test(ipAddress)) {
            return (true);
        }
        throw new InvalidInputException(
            `IP address ${ipAddress} does not match the following regex: ${ipRegex}`);
    },

    /**
     * Check Port validate
     *
     * @function checkPort
     *
     * @param {string} wsPort - port string.
     * @returns {boolean} - return true or false.
     */
    checkPort(wsPort) {
        return (wsPort > portRange[0]) && (wsPort < portRange[1]);
    },

    /**
     * Compare object fields with required fields
     *
     * @function checkRequiredFields
     *
     * @param {object} object - object.
     * @param {array} requiredFields - array with fields name.
     * @returns {undefined} - nothing to return (just keep going code algorithm) or throw exception.
     */
    checkRequiredFields(object, requiredFields) {
        for (let i = 0; i < requiredFields.length; i++) {
            if (!object.hasOwnProperty(requiredFields[i]) ||
                (typeof object[requiredFields[i]] === 'string' && object[requiredFields[i]].length < 1)) {
                throw new MissingRequiredParameterException(requiredFields[i]);
            }
        }
    },

    /**
     * Convert ip bytes string (like `0x132`) to string (like `2.2.2.2`)
     *
     * @function ipBytesToString
     *
     * @param {string} ipBytes - string (like `0x654sd`)
     * @returns {string} - returns string ip (like `5.5.5.5`)
     */
    ipBytesToString(ipBytes) {
        let bytesArr = ipBytes.slice(2).match(/.{1,2}/g);
        let res = '';
        for (let i = 0; i < bytesArr.length; i++) {
            res += web3.utils.hexToNumber('0x' + bytesArr[i]);
            if (i === bytesArr.length - 1) {
                break;
            }
            res += '.';
        }
        return res;
    },

    /**
     * Convert ip string (like `0x132`) to bytes string (like `0x132`)
     *
     * @function ipStringToBytes
     *
     * @param {string} ipString - string (like `2.2.2.2`)
     * @returns {string} - returns bytes string ip (like `0x132`)
     */
    ipStringToBytes(ipString) {
        let ipArr = ipString.split('.');
        let res = '0x';
        for (let i = 0; i < ipArr.length; i++) {
            let hexOctet = web3.utils.numberToHex(ipArr[i]);
            res += this.addZeroesToByte(hexOctet, 1).slice(2);
        }
        return res;
    },

    /**
     * Create one byte string from array of byte strings
     *
     * @function addByteStrings
     *
     * @param {array} byteStrings - array of byte strings (like [`0x..`, `0x..`, ...])
     * @returns {string} - return string (like `0x132`)
     */
    addByteStrings(byteStrings) {
        let resStr = '';
        for (let i = 0; i < byteStrings.length; i++) {
            resStr += this.rmBytesSymbol(byteStrings[i]);
        }
        return this.addBytesSymbol(resStr);
    },

    /**
     * Erase `0` after `0x` from byte string
     *
     * @function rmZerosByteString
     *
     * @param {array} byteString - byte string (like `0x0qqw`)
     * @returns {string} - return string (like `0xqqw`)
     */
    rmZerosByteString(byteString) {
        let str = byteString.slice(2);
        while (str.charAt(0) === '0') {
            str = str.substr(1);
        }
        return this.addBytesSymbol(str);
    },

    /**
     * Get address from public key
     *
     * @function getAddrFromPubKey
     *
     * @param {string} pubKey - public key string
     * @returns {string} - address string
     */
    getAddrFromPubKey(pubKey) {
        return Web3.utils.soliditySha3({t: 'bytes', v: pubKey});
    },

    /**
     * Get public key from private key
     *
     * @function privateKeyToPublic
     *
     * @param {string} privateKey - private key string
     * @returns {string} - public key string
     */
    privateKeyToPublic(privateKey) {
        // Get a wallet instance from a private key
        let privateKeyBuffer = EthUtil.toBuffer(privateKey);
        let wallet = Wallet.fromPrivateKey(privateKeyBuffer);
        // Get a public key

        let publicKey = wallet.getPublicKeyString();
        return publicKey;
    }

};
module.exports = Helper;
