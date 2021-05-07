import chaiAsPromised from "chai-as-promised";
import chai = require("chai");
let Web3 = require('web3');

import Skale from '../src/index';



const ENDPOINT = process.env["ENDPOINT"];


chai.should();
chai.use(chaiAsPromised);

describe("Skale Test!", () => {
  before(async () => {

  });

  it("Gets current block", async () => {
    const provider = new Web3.providers.HttpProvider(ENDPOINT);
    let web3 = new Web3(provider);
    let abis = 1;
    let skale = new Skale(web3, abis);
    const block = await skale.getBlock();
    block.should.be.equal(await web3.eth.getBlockNumber());

    skale.initContracts();
  });

});