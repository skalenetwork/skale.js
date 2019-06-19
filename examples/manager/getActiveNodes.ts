require('dotenv').config({ path: '../../.env' });

import skale = require('../../src/index');
import Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const abiData = require('../../contracts_data/main.json');

// !!!! for example
const nodeID = 2;
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await (skale as any).initWithProvider(web3SocketProvider, abiData);

    // IPs only
    let ips = await (skale as any).contract('nodes_data').getActiveNodeIPs();
    for (let ip of ips) {
        console.log(`Bytes ${ip}, String: ${(skale as any).helper.ipBytesToString(ip)}`);
    }

    console.log('-----------------');
    console.log('FOR SENDER');

    // Full Node structure (for sender)
    let activeNodesForSender = await (skale as any).contract('nodes_data').getActiveNodesForSender();
    console.log('activeNodesForSender: ', activeNodesForSender);

    console.log('-----------------');
    console.log('ALL');

    // Full Node structure (ALL)
    let activeNodes = await (skale as any).contract('nodes_data').getActiveNodes();
    console.log('activeNodes: ', activeNodes);
    console.log(activeNodes.length);

    let nodeObj = await (skale as any).contract('nodes_data').getNode({nodeID: nodeID});
    console.log('nodeObj', nodeObj);
    //
    process.exit(0);
}

test();
