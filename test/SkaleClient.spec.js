require('dotenv').config();

const assert = require('chai').assert;
const skale = require('../src/index');
const Web3 = require('web3');
const W3CWebSocket = require('websocket').w3cwebsocket;

// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
let wsAddr = 'ws://' + ip + ':' + port;
describe('skale', function () {
    describe('init()', function () {

        after(function () {
            skale.w3.closeConnection();
        });

        beforeEach(async function () {
            let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
            await skale.initBothProviders(ip, port, web3SocketProvider);
        });

        it('should connect to WebSocket', function () {
            assert(skale.w3.web3 instanceof Web3);
            assert(skale.w3.web3.currentProvider.connection instanceof W3CWebSocket);
            assert.strictEqual(skale.w3.web3.currentProvider.connection.url, wsAddr);
        });

        it('Should have initialized `manager` contract', function () {
            assert(skale.contract('manager').web3contract instanceof skale.w3.web3.eth.Contract);
        });

        it('Should have initialized `token` contract', function () {
            assert(skale.contract('token').web3contract instanceof skale.w3.web3.eth.Contract);
        });

        it('Should have initialized `schains_data` contract', async function () {
            assert(skale.contract('schains_data').web3contract instanceof skale.w3.web3.eth.Contract);
            let schainsDataContract = await skale.w3.getContractByName('schains_data');
            assert.exists(schainsDataContract.contractAddress, 'address doesn`t exists');
            assert.include(schainsDataContract.contractAddress, '0x', 'address doesn`t contain `0x`');
        });

    });
});

