require('dotenv').config();

import {assert} from 'chai';
import skale = require('../src/index');
import Web3 = require('web3');
import W3CWebSocket = require('websocket');

// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
let wsAddr = 'ws://' + ip + ':' + port;
const abiData = require('../contracts_data/main.json');

describe('skale', function () {
    describe('init()', function () {

        after(function () {
            (skale as any).w3.closeConnection();
        });

        beforeEach(async function () {
            let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
            await (skale as any).initWithProvider(web3SocketProvider, abiData);
        });

        it('should connect to WebSocket', function () {
            assert((skale as any).w3.web3 instanceof Web3);
            assert((skale as any).w3.web3.currentProvider.connection instanceof W3CWebSocket.w3cwebsocket);
            assert.strictEqual((skale as any).w3.web3.currentProvider.connection.url, wsAddr);
        });

        it('Should have initialized `manager` contract', function () {
            assert((skale as any).contract('manager').web3contract instanceof
                (skale as any).w3.web3.eth.Contract);
        });

        it('Should have initialized `token` contract', function () {
            assert((skale as any).contract('token').web3contract instanceof
                (skale as any).w3.web3.eth.Contract);
        });

        it('Should have initialized `schains_data` contract', async function () {
            assert((skale as any).contract('schains_data').web3contract instanceof
                (skale as any).w3.web3.eth.Contract);
            let schainsDataContract = await (skale as any).w3.getContractByName('schains_data');
            assert.exists(schainsDataContract.contractAddress, 'address doesn`t exists');
            assert.include(schainsDataContract.contractAddress, '0x', 'address doesn`t contain `0x`');
        });

    });
});

