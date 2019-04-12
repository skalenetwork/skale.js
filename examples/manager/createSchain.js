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

    let listener = new skale.Listener(skale.contract('schains_functionality').events.SchainCreated(),
        async function (event) {
            console.log('EVENT');
            console.log(event.returnValues);

            let SchainName = event.returnValues.name;
            let SchainId = await skale.contract('schains_data').sChainNameToId(SchainName);
            // get schain after create
            let Schain = await skale.contract('schains_data').getSchain({id: SchainId});
            console.log('------------');
            console.log(Schain);
            console.log('------------');
        });
    console.log(listener);

    let typeOfNodes = 1;
    let lifetimeInYears = 1;
    let lifetimeInSeconds = lifetimeInYears * 366 * 86400;
    let deposit = await skale.contract('schains_functionality').getSchainPrice({
        indexOfType: typeOfNodes, lifetime: lifetimeInSeconds});
    let params = {
        lifetime: lifetimeInSeconds,
        typeOfNodes: typeOfNodes,
        deposit: deposit,
        name: Rand.randomString(7),
        privateKey: privateKey,
        account: account
    };
    await skale.contractEv('manager').createSchain(params);
    //
    process.exit(0);
}

test();

