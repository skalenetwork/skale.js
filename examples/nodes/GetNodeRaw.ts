require('dotenv').config({ path: '../../.env' });

import skale = require('../../src/index');
import Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const abiData = require('../../contracts_data/main.json');
// !!!! for example only
const nodeID = 23;
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await (skale as any).initWithProvider(web3SocketProvider, abiData);

    let nodeRaw = await (skale as any).contract('nodes_data').getNodeRaw(nodeID);
    console.log(nodeRaw);
    //
    process.exit(0);
}

test();
