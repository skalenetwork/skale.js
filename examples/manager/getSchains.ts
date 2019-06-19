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

    await (skale as any).contract('schains_data').getSchainListInfo({account: account
    }).then(function (schains) {
        console.log('SCHAINS: ', schains);
    }).catch((error) => {
        console.log(error);
    });
    //
    process.exit(0);
}

test();
