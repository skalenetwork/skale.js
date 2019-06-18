require('dotenv').config();

import {assert, expect} from 'chai';

import skale = require('../src/index');
import Web3 = require('web3');
import Rand = require('../src/common/Rand');

import NoWeb3ProvidedException = require('../src/exceptions/NoWeb3Provided');
import MissingRequiredParameterException = require('../src/exceptions/MissingRequiredParameterException');
import AbstractMethodException = require('../src/exceptions/AbstractMethod');
import InvalidInputException = require('../src/exceptions/InvalidInput');
import NoContractFoundException = require('../src/exceptions/NoContractFound');

// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const privateKey = process.env.ETH_PRIVATE_KEY;
const abiData = require('../contracts_data/main.json');

//
const sChainName = Rand.randomString(7);
describe('check throw exceptions', function () {
    beforeEach(async function () {
        let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
        await (skale as any).initWithProvider(web3SocketProvider, abiData);
    });

    it('should throw NoWeb3ProvidedException checkWeb3()', function () {
        (skale as any).w3.web3 = undefined;
        expect(function () {
            (skale as any).w3.checkWeb3();
        }).to.throw((new NoWeb3ProvidedException).message);
    });

    it('should throw MissingRequiredParameterException', async function () {
        let requiredFields = ['Fake_Data'];
        let params = {
            name: sChainName,
            privateKey: privateKey,
            account: account
        };
        expect(function () {
            (skale as any).helper.checkRequiredFields(params, requiredFields);
        }).to.throw((new MissingRequiredParameterException(requiredFields[0])).message);
    });

    it('should throw AbstractMethodException', async function () {
        let listener = new (skale as any).Listener(skale.contract('schains_functionality').events.SchainCreated());
        expect(function () {
            listener.eventCallback();
        }).to.throw((new AbstractMethodException('schains_functionality')).message);
    });

    it('should throw InvalidInputException', async function () {
        let ipAddress = 'Fake_Data';
        const ipRegex = new RegExp(['^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
            '.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'].join(''));
        expect(function () {
            (skale as any).helper.validateIPaddress(ipAddress);
        }).to.throw((new InvalidInputException(
            `IP address ${ipAddress} does not match the following regex: ${ipRegex}`)).message);
    });

    it('should throw NoContractFoundException checkWeb3()', function () {
        expect(function () {
            (skale as any).w3.getContractByName('Fake_Data');
        }).to.throw((new NoContractFoundException('Fake_Data')).message);
    });

});
