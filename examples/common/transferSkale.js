require('dotenv').config({path: '../../.env'});

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

    let promise = await skale.contract('token').transfer({
        from: account, to: 'recipientAccount', amount: 'amount of SKALE tokens in wei',
        privateKey: privateKey
    });
    console.log(promise);
    //
    process.exit(0);
}

test();

