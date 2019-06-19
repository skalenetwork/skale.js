require('dotenv').config({ path: '../../.env' });

import skale = require('../../src/index');
import Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const abiData = require('../../contracts_data/main.json');
// !!!!
const indexOfType = 'Number from 1 to 4 here';
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await (skale as any).initWithProvider(web3SocketProvider, abiData);

    let priceInWei = await (skale as any).contract('schains_functionality').getSchainPrice({
        indexOfType: indexOfType, lifetime: 31622400
    });
    console.log('Price: ', priceInWei);
    //
    process.exit(0);
}

test();
