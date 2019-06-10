require('dotenv').config();

const constants = require('./constantsForTests');
const expect = require('chai').expect;
const assert = require('chai').assert;
const Rand = require('../src/common/Rand');
const skale = require('../src/index');
const Web3 = require('web3');
const Helper = require('../src/common/Helper');

// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const privateKey = process.env.ETH_PRIVATE_KEY;
//
const sChainName = Rand.randomString(7);
describe('check SchainData contract methods', function () {

    describe('check SchainData contract methods', function () {
        let schainId;
        let nodeID;
        after(function () {
            skale.w3.closeConnection();
        });

        beforeEach(async function () {
            let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
            await skale.initBothProviders(ip, port, web3SocketProvider);
        });

        it('should Schain create for tests below', async function () {
            let deposit = await skale.contract('schains_functionality').getSchainPrice({
                indexOfType: constants.TYPE_OF_NODES, lifetime: constants.YEAR_IN_SECONDS
            });
            let params = {
                lifetime: constants.YEAR_IN_SECONDS,
                typeOfNodes: constants.TYPE_OF_NODES,
                deposit: deposit,
                name: sChainName,
                privateKey: privateKey,
                account: account
            };
            let res = new skale.Listener(skale.contract('schains_functionality').events.SchainCreated(),
                async function (event) {
                    let SchainName = event.returnValues.name;
                    assert.equal(SchainName, params.name, 'SchainName equal `params.name`');
                });
            await skale.contractEv('manager').createSchain(params).then(function (nonce) {
                expect(parseInt(nonce, 10)).to.be.a('number');
            });
            assert.isNotNull(res, 'is not null');

        });

        it('should get Schain ID by Schain name', async function () {
            //
            await Helper.timeout(5000);
            schainId = await skale.contract('schains_data').sChainNameToId(sChainName);
            assert.isNotNull(schainId, 'is not null');
            assert.isString(schainId, 'isString');
            //
        });

        it('should get Schain by Schain ID', async function () {
            await Helper.timeout(5000);
            let schain = await skale.contract('schains_data').getSchain({id: schainId});
            console.log('schainName', schain.name);
            console.log('schainName', sChainName);

            assert.equal(schain.name, sChainName, 'equal');
            assert.isNotNull(schain.name, 'isNotNull');
            assert.isNotNull(schain.owner, 'isNotNull');
            assert.isNotNull(schain.indexInOwnerList, 'isNotNull');
            assert.isNotNull(schain.partOfNode, 'isNotNull');
            assert.isNotNull(schain.lifetime, 'isNotNull');
            assert.isNotNull(schain.startDate, 'isNotNull');
            assert.isNotNull(schain.deposit, 'isNotNull');
        });

        it('should check if Schain name is available', async function () {
            let res = await skale.contract('schains_data').isSchainNameAvailable({name: sChainName});
            assert.isNotTrue(res, 'name are not available');
            assert.isFalse(res, 'name are not available');
        });

        it('should return array of Schain nodes', async function () {
            let nodes = await skale.contract('schains_data').getNodesForSchain(sChainName);
            let node = nodes[0];
            assert.isArray(nodes, 'nodes is array');
            assert.isObject(node, 'contain object in array');
            assert.include(node.ip, '0x', 'contain `0x` in ip');
        });

        it('should return array of Schain nodes IDs', async function () {
            let nodeIDs = await skale.contract('schains_data').getNodeIdsForSchain(sChainName);
            assert.isArray(nodeIDs, 'nodes is array');
            assert.isNumber(parseInt(nodeIDs[0], 10), 'it is number');
        });

        it('should return array of Schain nodes with unhexed (without `0x`) in IP fields', async function () {
            let nodes = await skale.contract('schains_data').getNodesForSchainConfig(sChainName);
            let node = nodes[0];
            assert.isArray(nodes, 'nodes is array');
            assert.isObject(node, 'contain object in array');
            assert.include(node.ip, '.', 'contain `.` in ip for example `151.234.123.38`');
        });

        it('should return array of Schain nodes with add `rpcPort` to node', async function () {
            let schainNodes = await skale.contract('schains_data').getSchainNodes(sChainName);
            let nodes = schainNodes['schainNodes'];
            let node = nodes[0];
            nodeID = node.nodeID;
            assert.isArray(nodes, 'nodes is array');
            assert.isObject(node, 'contain object in array');
            assert.isNumber(node.httpRpcPort, 'it is number');
            assert.isNumber(node.httpsRpcPort, 'it is number');
            assert.isNumber(node.wsRpcPort, 'it is number');
            assert.isNumber(node.wssRpcPort, 'it is number');
        });

        it('should return array of Schain IDs running on a node by nodeID', async function () {
            let schainIDs = await skale.contract('schains_data').getSchainIdsForNode({'nodeID': nodeID});
            assert.isArray(schainIDs, 'nodes is array');
            assert.isNumber(parseInt(schainIDs[0], 10), 'it is number');
        });

        it('should show list of Schains', async function () {
            let arrayOfSchain = await skale.contract('schains_data').getSchainListInfo({'account': account});
            assert.isArray(arrayOfSchain, 'no, it is not an array');
            assert.isObject(arrayOfSchain[0], 'no, it`s not an object');
        });

        it('should destroy Schain for cleaning', async function () {
            console.log('should destroy Schain');
            let params = {
                name: sChainName,
                privateKey: privateKey,
                account: account
            };
            await skale.contractEv('manager').deleteSchain(params);
        });

    });

});

