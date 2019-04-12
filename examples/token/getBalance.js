require('dotenv').config({ path: '../../.env' });

const skale = require('../../src/index');
const Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    let accountSkaleWeiBalance = await skale.contract('token').balanceOf(account);
    let accountSkaleBalance = skale.w3.web3.utils.fromWei(accountSkaleWeiBalance.toString());
    console.log('Balance: ', accountSkaleBalance);
    //
    process.exit(0);
}

test();

