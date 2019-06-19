require('dotenv').config({ path: '../../.env' });

import skale = require('../../src/index');
import Web3 = require('web3');
import Rand = require('../../src/common/Rand');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const abiData = require('../../contracts_data/main.json');

//
const nodeName = Rand.randomString(6);
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await (skale as any).initWithProvider(web3SocketProvider, abiData);

    (skale as any).contract('nodes_data').isNodeNameAvailable(nodeName).then(function (res) {
        console.log(res);
    }).catch((error) => {
        console.log(error);
    });
    //
    process.exit(0);
}

test();
