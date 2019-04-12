require('dotenv').config({ path: '../../.env' });

const skale = require('../../src/index');
const Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
// !!!! for example
const nodeID = 23;
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    let nodeRaw = await skale.contract('nodes_data').getNodeRaw(nodeID);
    console.log(nodeRaw);
    //
    process.exit(0);
}

test();
