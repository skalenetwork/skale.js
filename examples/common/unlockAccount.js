require('dotenv').config({path: '../../.env'});

const skale = require('../../src/index');
const Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
//
const unlockTimeInSeconds = 6546;
async function unlock() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    let res = await skale.w3.unlockAccount(account, unlockTimeInSeconds, 'PASSWORD');
    console.log('Result:' + res);
    //
    process.exit(0);
}

unlock();

