import fs from 'fs';

import Web3 from 'web3';
import {AbiItem} from 'web3-utils';

import * as dotenv from "dotenv";

import Skale from '../src/index';

dotenv.config();

const ENDPOINT = (process.env["ENDPOINT"] as string);
const ABI_FILEPATH = process.env["ABI_FILEPATH"] || __dirname + '/manager.json';


export function initTestSkale() {
    const web3 = new Web3(ENDPOINT);
    const abi = jsonFileLoad(ABI_FILEPATH);
    return new Skale(web3, abi);
}

export function jsonFileLoad(path: string) {
    if (!fileExists(path)) {
        return {}
    }
    const s = fs.readFileSync(path);
    const jo = JSON.parse(s.toString());
    return jo;
}

export function fileExists(strPath: string) {
    if (fs.existsSync(strPath)) {
        const stats = fs.statSync(strPath);
        if (stats.isFile())
            return true;
    }
    return false;
}