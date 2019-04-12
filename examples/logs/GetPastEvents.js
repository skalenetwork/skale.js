require('dotenv').config({ path: '../../.env' });

// const Rand = require('../../src/common/Rand');
const skale = require('../../src/index');
const Web3 = require('web3');
// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
async function test() {

    let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
    await skale.initBothProviders(ip, port, web3SocketProvider);

    let from = [];
    let contracts = [
        {'nodes_functionality': ['NodeCreated', 'WithdrawDepositFromNodeComplete', 'WithdrawDepositFromNodeInit']},
        {'schains_functionality': ['SchainCreated', 'SchainNodes']}
    ];
    for (let i = 0; i < contracts.length; i++) {
        let contr = contracts[i];
        let contractName = Object.keys(contr)[0];
        let arrOfEventNames = contr[contractName];
        for (let y = 0; y < arrOfEventNames.length; y++) {
            let eventName = arrOfEventNames[y];
            from.push(await skale.contract(contractName).web3contract.getPastEvents(eventName, {

                filter: {_from: account},
                fromBlock: 0,
                toBlock: 'latest'
                // toBlock: 100
            }, function (error, events) {
                if (error) console.error(error);
            })
            );
        }

    }
    //
    console.log(from);
    //
    process.exit(0);
}

test();
