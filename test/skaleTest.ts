import chaiAsPromised from "chai-as-promised";
import chai = require("chai");
import * as dotenv from "dotenv";

let Web3 = require('web3');

import Skale from '../src/index';
import * as test_utils from './test_utils';

dotenv.config();

chai.should();
chai.use(chaiAsPromised);


describe("Main object test", () => {
    let address: string;
    let skale: Skale;
    

    before(async () => {
        skale = test_utils.initTestSkale();
    });

    it("Gets all sChains from the network", async () => {
        let schains = await skale.contracts.schainsInternal.getSchainsNames();
        console.log(schains);
        schains.should.be.a('array');
    });
})