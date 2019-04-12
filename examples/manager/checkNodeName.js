require('dotenv').config({ path: '../../.env' });

const skale = require('../../src/index');
const Web3 = require('web3');
const Rand = require('../../src/common/Rand');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
//
const nodeName = Rand.randomString(6);
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    skale.contract('nodes_data').isNodeNameAvailable(nodeName).then(function (res) {
        console.log(res);
    }).catch((error) => {
        console.log(error);
    });
    //
    process.exit(0);
}

test();
