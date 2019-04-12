require('dotenv').config({ path: '../../.env' });

const skale = require('../../src/index');
const Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
// !!!! for example
const nodeID = 2;
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    // IPs only
    let ips = await skale.contract('nodes_data').getActiveNodeIPs();
    for (let ip of ips) {
        console.log(`Bytes ${ip}, String: ${skale.helper.ipBytesToString(ip)}`);
    }

    console.log('-----------------');
    console.log('FOR SENDER');

    // Full Node structure (for sender)
    let activeNodesForSender = await skale.contract('nodes_data').getActiveNodesForSender();
    console.log('activeNodesForSender: ', activeNodesForSender);

    console.log('-----------------');
    console.log('ALL');

    // Full Node structure (ALL)
    let activeNodes = await skale.contract('nodes_data').getActiveNodes();
    console.log('activeNodes: ', activeNodes);
    console.log(activeNodes.length);

    let nodeObj = await skale.contract('nodes_data').getNode({nodeID: nodeID});
    console.log('nodeObj', nodeObj);
    //
    process.exit(0);
}

test();
