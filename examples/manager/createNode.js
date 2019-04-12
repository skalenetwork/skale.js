require('dotenv').config({ path: '../../.env' });

const skale = require('../../src/index');
const Web3 = require('web3');
const Rand = require('../../src/common/Rand');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const privateKey = process.env.ETH_PRIVATE_KEY;
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    // generate random node_ip
    let nodeIP = (Math.floor(Math.random() * 255) + 1) + '.' + (Math.floor(Math.random() * 255) + 0) + '.' +
        (Math.floor(Math.random() * 255) + 0) + '.' + (Math.floor(Math.random() * 255) + 0); // generate random node_port
    let nodePort = (Math.floor(Math.random() * 60535) + 1);
    let params = {
        ip: nodeIP,
        port: nodePort,
        name: Rand.randomString(6),
        privateKey: privateKey,

        account: account
    };
    console.log(params);

    let res = await skale.contract('manager').createNode(params);
    let trRes = await res.promise;
    console.log('after NODE create');
    console.log(trRes);
    //
    process.exit(0);
}

test();

