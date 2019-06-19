require('dotenv').config({path: '../../.env'});

import skale = require('../../src/index');
import Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const abiData = require('../../contracts_data/main.json');
//
const unlockTimeInSeconds = 6546;
async function unlock() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await (skale as any).initWithProvider(web3SocketProvider, abiData);

    let res = await (skale as any).w3.unlockAccount(account, unlockTimeInSeconds, 'PASSWORD');
    console.log('Result:' + res);
    //
    process.exit(0);
}

unlock();

