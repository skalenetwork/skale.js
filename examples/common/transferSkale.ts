require('dotenv').config({path: '../../.env'});

import skale = require('../../src/index');
import Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const privateKey = process.env.ETH_PRIVATE_KEY;
const abiData = require('../../contracts_data/main.json');
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await (skale as any).initWithProvider(web3SocketProvider, abiData);

    let promise = await (skale as any).contract('token').transfer({
        from: account, to: 'recipientAccount', amount: 'amount of SKALE tokens in wei',
        privateKey: privateKey
    });
    console.log(promise);
    //
    process.exit(0);
}

test();

