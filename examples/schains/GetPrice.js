require('dotenv').config({ path: '../../.env' });

const skale = require('../../src/index');
const Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
// !!!!
const indexOfType = 'Number from 1 to 4 here';
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    let priceInWei = await skale.contract('schains_functionality').getSchainPrice({
        indexOfType: indexOfType, lifetime: 31622400
    });
    console.log('Price: ', priceInWei);
    //
    process.exit(0);
}

test();
