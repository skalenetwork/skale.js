require('dotenv').config();

const assert = require('chai').assert;
const skale = require('../src/index');
const Web3 = require('web3');

// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
describe('get logs for account', function () {
    describe('getPastEvents for web3contract', function () {
        //
        let log;
        after(function () {
            skale.w3.closeConnection();
        });

        beforeEach(async function () {
            let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
            await skale.initBothProviders(ip, port, web3SocketProvider);
        });

        it('should return array of array of objects', async function () {
            let arrayOfarray = [];
            let contracts = [
                {
                    'nodes_functionality': ['NodeCreated', 'WithdrawDepositFromNodeComplete',
                        'WithdrawDepositFromNodeInit']
                },
                {'schains_functionality': ['SchainCreated', 'SchainNodes']}
            ];
            //

            for (let i = 0; i < contracts.length; i++) {
                let contr = contracts[i];
                let contractName = Object.keys(contr)[0];
                let arrOfEventNames = contr[contractName];
                for (let y = 0; y < arrOfEventNames.length; y++) {
                    let eventName = arrOfEventNames[y];
                    //

                    arrayOfarray.push(await skale.contract(contractName).web3contract.getPastEvents(eventName, {
                        filter: {_from: account},
                        fromBlock: 0,
                        toBlock: 'latest'
                    }, function (error, events) {
                        if (error) console.error(error);
                    })
                    );
                }
            }

            log = arrayOfarray[0][0];
            let arrayOfHashes = arrayOfarray[0];
            assert.isArray(arrayOfarray, 'yes, it`s array');
            assert.isTrue(arrayOfarray.length > 0, 'yep');
            assert.isArray(arrayOfHashes, 'yes, it`s array');
            assert.isObject(log, 'yes, it`s object');
        });

        it('should return correct fields in log', function () {
            assert.isNotNull(log.address, 'isNotNull');
            assert.isNotNull(log.id, 'isNotNull');
            assert.isNotNull(log.transactionHash, 'isNotNull');
            assert.isNotNull(log.returnValues, 'isNotNull');
            assert.isNotNull(log.event, 'isNotNull');
            assert.isNotNull(log.blockNumber, 'isNotNull');
            assert.isNotNull(log.raw, 'isNotNull');
        });

    });
});

