require('dotenv').config();

import {assert} from 'chai';
import Rand = require('../src/common/Rand');
import skale = require('../src/index');
import Web3 = require('web3');

// data from .env
const ip = process.env.IP;
const port = process.env.PORT;
const account = process.env.ETH_ACCOUNT;
const privateKey = process.env.ETH_PRIVATE_KEY;
const abiData = require('../contracts_data/main.json');

describe('check NodeData contract methods', function () {

    describe('check NodeData contract methods', function () {

        let nodeName; // generate random node_ip
        let nodeIP = (Math.floor(Math.random() * 255) + 1) + '.' + (Math.floor(Math.random() * 255) + 0) + '.' +
            (Math.floor(Math.random() * 255) + 0) + '.' + (Math.floor(Math.random() * 255) + 0);
        after(function () {
            (skale as any).w3.closeConnection();
        });

        beforeEach(async function () {
            let web3SocketProvider = new Web3.providers.WebsocketProvider(`ws://${ip}:${port}`);
            await (skale as any).initWithProvider(web3SocketProvider, abiData);
        });

        it('should create a node', async function () {

            // generate random node_port
            let nodePort = (Math.floor(Math.random() * 60535) + 1);
            let params = {
                ip: nodeIP,
                port: nodePort,
                name: Rand.randomString(6),
                privateKey: privateKey,

                account: account
            };
            let res = await (skale as any).contract('manager').createNode(params);
            let trRes = await res.promise;
            assert.isBoolean(trRes.status, 'is a boolean');
            assert.isTrue(trRes.status, 'node created');
        });

        it('should get Active Nodes For Sender ', async function () {
            let nodes = await (skale as any).contract('nodes_data').getActiveNodesForSender();
            assert.isArray(nodes, 'nodes is array');
        });

        it('should get Active Nodes (Full Node structure)', async function () {
            let nodes = await (skale as any).contract('nodes_data').getActiveNodes();
            nodeName = nodes[0].name;
            assert.isArray(nodes, 'nodes is an array');
            assert.isString(nodeName, 'node is a string');
        });

        it('should get IDs for Active Nodes', async function () {
            let nodesIDs = await (skale as any).contract('nodes_data').getActiveNodeIDs();
            assert.isArray(nodesIDs, 'nodesIDs is array');
        });

        it('should get IDs for Active Nodes For Sender', async function () {
            let nodesIDs = await (skale as any).contract('nodes_data').getActiveNodeIDsForSender();
            assert.isArray(nodesIDs, 'nodesIDs is array');
        });

        it('should get node by id with format fields', async function () {
            let node = await (skale as any).contract('nodes_data').getNode({'nodeID': 0});
            assert.isObject(node, 'node is object');
        });

        it('should get node by id with `native` (not format) fields', async function () {
            let node = await (skale as any).contract('nodes_data').getNodeRaw(0);
            assert.isObject(node, 'node is object');
        });

        it('should return id by name', async function () {
            let nodeID = await (skale as any).contract('nodes_data').nodeNameToId(nodeName);
            assert.isString(nodeID, 'nodeID is a string');
            assert.include(nodeID, '0x', 'include `0x` in in ID');
        });

        it('should check a node `name` is available', async function () {
            let boolean = await (skale as any).contract('nodes_data').isNodeNameAvailable(nodeName);
            assert.isBoolean(boolean, 'is a boolean');
            assert.isFalse(boolean, 'name already is busy');
        });

        it('should tell when node need to get bounty', async function () {
            let timeInSeconds = await (skale as any).contract('nodes_data').getNodeNextRewardDate({'nodeIndex': 0});
            assert.isString(timeInSeconds, 'number of seconds');
        });

        it('should transform bytes to ip string', async function () {
            let bytes = (skale as any).helper.ipStringToBytes(nodeIP);
            let ip = (skale as any).helper.ipBytesToString(bytes);
            assert.strictEqual(ip, nodeIP, 'these variables are strictly equal');
        });

        it('should erase `0` from bytes string', async function () {
            let bytes = (skale as any).helper.ipStringToBytes(nodeIP);
            let withoutZeroAfter0x = (skale as any).helper.rmZerosByteString(bytes);
            assert.notInclude(withoutZeroAfter0x, '0x0', 'array doesn\'t contain value');
        });

    });

});

