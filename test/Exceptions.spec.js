require('dotenv').config();

const assert = require('assert');

const skale = require('../src/index');
const Web3 = require('web3');
const Rand = require('../src/common/Rand');

const NoWeb3ProvidedException = require('../src/exceptions/NoWeb3Provided');
const MissingRequiredParameterException = require('../src/exceptions/MissingRequiredParameterException');
const AbstractMethodException = require('../src/exceptions/AbstractMethod');
const InvalidInputException = require('../src/exceptions/InvalidInput');
const NoContractFoundException = require('../src/exceptions/NoContractFound');

// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const privateKey = process.env.ETH_PRIVATE_KEY;
//
const sChainName = Rand.randomString(7);
describe('check throw exceptions', function () {
    beforeEach(async function () {
        let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
        await skale.initBothProviders(ip, port, web3SocketProvider);
    });

    it('should throw NoWeb3ProvidedException checkWeb3()', function () {
        assert.throws(skale.w3.checkWeb3, NoWeb3ProvidedException);
    });

    it('should throw MissingRequiredParameterException', async function () {
        let requiredFields = ['Fake_Data'];
        let params = {
            name: sChainName,
            privateKey: privateKey,
            account: account
        };
        assert.throws(() => {
            skale.helper.checkRequiredFields(params, requiredFields);
        }, MissingRequiredParameterException);
    });

    it('should throw AbstractMethodException', async function () {
        let listener = new skale.Listener(skale.contract('schains_functionality').events.SchainCreated());
        assert.throws(() => {
            listener.eventCallback();
        }, AbstractMethodException);
    });

    it('should throw InvalidInputException', async function () {
        assert.throws(() => {
            skale.helper.validateIPaddress('Fake_Data');
        }, InvalidInputException);
    });

    it('should throw NoContractFoundException checkWeb3()', function () {
        assert.throws(() => {
            skale.w3.getContractByName('Fake_Data');
        }, NoContractFoundException);
    });

});
