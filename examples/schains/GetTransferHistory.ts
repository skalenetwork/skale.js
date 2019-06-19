require('dotenv').config({ path: '../../.env' });

import skale = require('../../src/index');
import Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const abiData = require('../../contracts_data/main.json');
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await (skale as any).initWithProvider(web3SocketProvider, abiData);

    let transferHistory = await (skale as any).contract('token').getTransferHistory(account);
    console.log('transferHistory', transferHistory);
    //
    process.exit(0);
}

test();
