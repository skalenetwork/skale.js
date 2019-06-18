require('dotenv').config();

import constants = require('./constantsForTests');

import { assert } from 'chai';

import skale = require('../src/index');
import Helper = require('../src/common/Helper');
import Web3 = require('web3');
import Rand = require('../src/common/Rand');

const abiData = require('../contracts_data/main.json');

// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const privateKey = process.env.ETH_PRIVATE_KEY;
//
const sChainName = Rand.randomString(7);
describe('check BaseListener methods', function () {

    let listener, eventReturnValues = '';
    before(async function () {
        let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
        await (skale as any).initWithProvider(web3SocketProvider, abiData);
        listener = new (skale as any).Listener(skale.contract('schains_functionality').events.SchainCreated(),
            async function (event) {
                // console.log('event event event event ', event);
                eventReturnValues = event.returnValues;
            });
    });

    it('check event fields', async function () {
        let deposit = await (skale as any).contract('schains_functionality').getSchainPrice({
            indexOfType: constants.TYPE_OF_NODES, lifetime: constants.YEAR_IN_SECONDS
        });
        let params = {
            lifetime: constants.YEAR_IN_SECONDS,
            typeOfNodes: constants.TYPE_OF_NODES,
            deposit: deposit,
            name: sChainName,
            privateKey: privateKey,
            account: account
        };
        await (skale as any).contract('manager').createSchain(params).then(function (nonce) {
        });
        // waiting for event
        while (eventReturnValues === '') {
            console.log('checkEvent');
            await Helper.timeout(1000);
        }
        //
        assert.equal((eventReturnValues as any).name, sChainName, 'equal');
        assert.isNotNull((eventReturnValues as any).name, 'isNotNull');
        assert.isNotNull((eventReturnValues as any).owner, 'isNotNull');
        assert.isNotNull((eventReturnValues as any).partOfNode, 'isNotNull');
        assert.isNotNull((eventReturnValues as any).lifetime, 'isNotNull');
        assert.isNotNull((eventReturnValues as any).numberOfNodes, 'isNotNull');
        assert.isNotNull((eventReturnValues as any).deposit, 'isNotNull');
        assert.isNotNull((eventReturnValues as any).gasSpend, 'isNotNull');
    });

    it('should turn off listener `.turnOff()`', async function () {
        listener.turnOff();
        await Helper.timeout(5000);
        assert.isFalse(listener.isActive(), 'is not active');
    });

    it('should turn off listener `.turnOff()`', async function () {
        listener.errorCallback('some error message');
        await Helper.timeout(5000);
    });

    it('should destroy Schain for cleaning', async function () {
        let params = {
            name: sChainName,
            privateKey: privateKey,
            account: account
        };
        await skale.contract('manager').deleteSchain(params);
    });

});

