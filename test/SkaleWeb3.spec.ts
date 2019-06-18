require('dotenv').config();

import { assert, expect } from 'chai';

import skale = require('../src/index');
import Web3 = require('web3');
import W3CWebSocket = require('websocket');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;

const wsAddr = 'ws://' + ip + ':' + port;
const abiData = require('../contracts_data/main.json');

describe('skaleWeb3', function () {

    beforeEach(async function () {
        let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
        await (skale as any).initWithProvider(web3SocketProvider, abiData);
    });

    describe('initWeb3()', function () {
        it('should init web3 instance in skaleWeb3 object with given WS address', function () {
            (skale as any).w3.initWeb3(wsAddr);

            assert((skale as any).w3.web3 instanceof Web3);
            assert((skale as any).w3.web3.currentProvider.connection instanceof
                W3CWebSocket.w3cwebsocket);
            assert.strictEqual((skale as any).w3.web3.currentProvider.connection.url, wsAddr);
        });
    });

    describe('checkWeb3() with initialized web3 ', function () {

        it('should NOT throw Exception', function () {
            assert((skale as any).w3.checkWeb3());
        });
    });

    describe('getContractByName()', function () {
        it('should return contract object', function () {
            assert((skale as any).w3.getContractByName('token').web3contract instanceof
                (skale as any).w3.web3.eth.Contract);
            assert((skale as any).w3.getContractByName('manager').web3contract instanceof
                (skale as any).w3.web3.eth.Contract);
        });
    });

    describe('closeConnection()', function () {
        it('should close WebSocket connection', function (done) {
            (skale as any).w3.closeConnection();
            assert(true);
            done();
        });
    });

});
