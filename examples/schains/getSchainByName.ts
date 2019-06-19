require('dotenv').config({ path: '../../.env' });

import skale = require('../../src/index');
import Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const abiData = require('../../contracts_data/main.json');
// !!!!
const schainName = 'NameOfYourSchainHere';
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await (skale as any).initWithProvider(web3SocketProvider, abiData);

    let sChainId = await (skale as any).contract('schains_data').sChainNameToId(schainName);
    let sChain = await (skale as any).contract('schains_data').getSchain({'id': sChainId});
    console.log(sChain);
    //
    process.exit(0);
}

test();
