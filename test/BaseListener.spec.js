require('dotenv').config();

const constants = require('./constantsForTests');

const assert = require('chai').assert;
const skale = require('../src/index');
const Helper = require('../src/common/Helper');
const Web3 = require('web3');
const Rand = require('../src/common/Rand');

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
        await skale.initBothProviders(ip, port, web3SocketProvider);
        listener = new skale.Listener(skale.contract('schains_functionality').events.SchainCreated(),
            async function (event) {
                // console.log('event event event event ', event);
                eventReturnValues = event.returnValues;
            });
    });

    it('check event fields', async function () {
        let deposit = await skale.contract('schains_functionality').getSchainPrice({
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
        await skale.contractEv('manager').createSchain(params).then(function (nonce) {
        });
        // waiting for event
        while (eventReturnValues === '') {
            console.log('checkEvent');
            await Helper.timeout(1000);
        }
        //
        assert.equal(eventReturnValues.name, sChainName, 'equal');
        assert.isNotNull(eventReturnValues.name, 'isNotNull');
        assert.isNotNull(eventReturnValues.owner, 'isNotNull');
        assert.isNotNull(eventReturnValues.partOfNode, 'isNotNull');
        assert.isNotNull(eventReturnValues.lifetime, 'isNotNull');
        assert.isNotNull(eventReturnValues.numberOfNodes, 'isNotNull');
        assert.isNotNull(eventReturnValues.deposit, 'isNotNull');
        assert.isNotNull(eventReturnValues.gasSpend, 'isNotNull');
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
        await skale.contractEv('manager').deleteSchain(params);
    });

});

