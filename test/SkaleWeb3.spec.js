require('dotenv').config();

const assert = require('assert');

// const skaleWeb3 = require('../src/SkaleWeb3');
const skale = require('../src/index');
const Web3 = require('web3');
const W3CWebSocket = require('websocket').w3cwebsocket;

const NoWeb3ProvidedException = require('../src/exceptions/NoWeb3Provided');
// const NoContractFoundException = require('../src/exceptions/NoContractFound');

// data from .env
const ip = process.env.IP;
const port = process.env.PORT;

const wsAddr = 'ws://' + ip + ':' + port;
describe('skaleWeb3', function () {

    beforeEach(async function () {
        let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
        await skale.initBothProviders(ip, port, web3SocketProvider);
    });

    describe('checkWeb3()', function () {
        it('should throw NoWeb3ProvidedException', function () {
            assert.throws(skale.w3.checkWeb3, NoWeb3ProvidedException);
        });
    });

    describe('initWeb3()', function () {
        it('should init web3 instance in skaleWeb3 object with given WS address', function () {
            skale.w3.initWeb3(wsAddr);

            assert(skale.w3.web3 instanceof Web3);
            assert(skale.w3.web3.currentProvider.connection instanceof W3CWebSocket);
            assert.strictEqual(skale.w3.web3.currentProvider.connection.url, wsAddr);
        });
    });

    describe('checkWeb3() with initialized web3 ', function () {

        it('should NOT throw Exception', function () {
            assert(skale.w3.checkWeb3());
        });
    });

    describe('getContractByName()', function () {
        it('should return contract object', function () {
            assert(skale.w3.getContractByName('token').web3contract instanceof skale.w3.web3.eth.Contract);
            assert(skale.w3.getContractByName('manager').web3contract instanceof skale.w3.web3.eth.Contract);
        });
    });

    describe('closeConnection()', function () {
        it('should close WebSocket connection', function (done) {
            skale.w3.closeConnection();
            assert(true);
            done();
        });
    });

});
