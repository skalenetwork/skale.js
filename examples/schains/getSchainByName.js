require('dotenv').config({ path: '../../.env' });

const skale = require('../../src/index');
const Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
// !!!!
const schainName = 'NameOfYourSchainHere';
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    let sChainId = await skale.contract('schains_data').sChainNameToId(schainName);
    let sChain = await skale.contract('schains_data').getSchain({'id': sChainId});
    console.log(sChain);
    //
    process.exit(0);
}

test();
