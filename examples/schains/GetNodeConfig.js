require('dotenv').config({ path: '../../.env' });

const skale = require('../../src/index');
const Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
// !!!!
const schainName = 'NameOfYourSchainHere';
async function test() {
    //
    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);
    // Returns information about the nodes with raw fields on which the SKALE chain is located
    let getNodesForSchain = await skale.contract('schains_data').getNodesForSchain(schainName);
    console.log('getNodesForSchain: ', getNodesForSchain);
    // Returns array of node ids on which the SKALE chain is located
    let getNodeIdsForSchain = await skale.contract('schains_data').getNodeIdsForSchain(schainName);
    console.log('getNodeIdsForSchain: ', getNodeIdsForSchain);
    // Returns information about the nodes with owner on which the SKALE chain is located
    let getNodesForSchainConfig = await skale.contract('schains_data').getNodesForSchainConfig(schainName);
    console.log('getNodesForSchainConfig', getNodesForSchainConfig);
    // Returns information about the nodes with rpc ports on which the SKALE chain is located
    let getSchainNodes = await skale.contract('schains_data').getSchainNodes(schainName);
    console.log('getSchainNodes: ', getSchainNodes);
    //
    process.exit(0);
}

test();
