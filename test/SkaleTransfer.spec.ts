require('dotenv').config();

import constants = require('./constantsForTests');
import {assert} from 'chai';
import skale = require('../src/index');
import Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const privateKey = process.env.ETH_PRIVATE_KEY;
const abiData = require('../contracts_data/main.json');

describe('transfer SKL from account to account', function () {
    describe('transfer to recipient account', function () {
        //
        let recipientAccount;
        after(function () {
            (skale as any).w3.closeConnection();
        });

        beforeEach(async function () {
            let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
            await (skale as any).initWithProvider(web3SocketProvider, abiData);
        });

        it('should create recipient account', async function () {
            recipientAccount = await (skale as any).w3.createAccount();
            assert.isObject(recipientAccount, 'recipientAccount is an object');
            assert.include(recipientAccount.address, '0x', '`recipientAccount.address` contains `0x`');
            assert.include(recipientAccount.privateKey, '0x', '`recipientAccount.privateKey` contains `0x`');
            assert.isString(recipientAccount.address, 'recipientAccount.address is a string');

        });

        it('should be transfer SKL in wei to recipient', async function () {
            let promise = await (skale as any).contract('token').transfer({
                from: account, to: recipientAccount.address, amount: constants.SEND_SKALE_IN_WEI,
                privateKey: privateKey
            });
            assert.isTrue(promise.status, 'the transfer passed');
        });

        it('get balance for recipient account', async function () {
            let sklInWei = await (skale as any).contract('token').balanceOf(recipientAccount.address);
            assert.equal(constants.SEND_SKALE_IN_WEI, sklInWei, 'weiVal == sklInWei');
        });

        it('should show tranfer history', async function () {
            let transfers = await (skale as any).contract('token').getTransferHistory(recipientAccount.address);
            assert.isArray(transfers.to, 'should be an array');
            assert.isObject(transfers.to[0], 'should be an object');
            assert.equal(transfers.to[0].returnValues._to, recipientAccount.address, 'should be equal');
            assert.equal(transfers.to[0].returnValues._from, account, 'should be equal');
        });
    });
});

