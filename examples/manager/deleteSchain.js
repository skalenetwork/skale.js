require('dotenv').config({ path: '../../.env' });

// const Rand = require('../../src/common/Rand');
const skale = require('../../src/index');
const Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const privateKey = process.env.ETH_PRIVATE_KEY;
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    let params = {
    // name: Rand.randomString(7),
        name: 'bnm',
        privateKey: privateKey,
        account: account
    };
    await skale.contractEv('manager').deleteSchain(params);

    console.log('deleted', params.name);
    //
    process.exit(0);
}

test();

