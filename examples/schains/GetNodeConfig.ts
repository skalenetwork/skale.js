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
    //
    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await (skale as any).initWithProvider(web3SocketProvider, abiData);
    // Returns information about the nodes with raw fields on which the SKALE chain is located
    let getNodesForSchain = await (skale as any).contract('schains_data').getNodesForSchain(schainName);
    console.log('getNodesForSchain: ', getNodesForSchain);
    // Returns array of node ids on which the SKALE chain is located
    let getNodeIdsForSchain = await (skale as any).contract('schains_data').getNodeIdsForSchain(schainName);
    console.log('getNodeIdsForSchain: ', getNodeIdsForSchain);
    // Returns information about the nodes with owner on which the SKALE chain is located
    let getNodesForSchainConfig = await (skale as any).contract('schains_data').getNodesForSchainConfig(schainName);
    console.log('getNodesForSchainConfig', getNodesForSchainConfig);
    // Returns information about the nodes with rpc ports on which the SKALE chain is located
    let getSchainNodes = await (skale as any).contract('schains_data').getSchainNodes(schainName);
    console.log('getSchainNodes: ', getSchainNodes);
    //
    process.exit(0);
}

test();
