import tmp = require('tmp');
import _ncp = require('ncp');
import {exec} from 'child_process';
import _debug = require('debug');
import utils = require('./utils');
import path = require('path');

const debug = _debug('peers');
const ncp = _ncp.ncp;

function testVersion(cache:string, peer:string, version:string, testCommand:string){

    const debug = _debug(`peers:peer:${peer}:version:${version}`);
    return new Promise((resolve, reject) => {

        //create temp dir
        tmp.dir({unsafeCleanup:true}, (err, path, cleanupCallback)=>{
            if (err) return reject(err);

            debug(`temp dir at ${path}`);

            //copy everything from cache to temp dir
            ncp(cache, path, (err) => {
                if (err) return reject(err);

                //install the peer dependency
                const command = `npm install ${peer}@${version}`;
                exec(command, {
                    cwd:path,
                    env:process.env
                }, (err) => {
                    debug('installed peer');
                    if (err) return reject(err);
                    exec(testCommand, {cwd:path, env:process.env}, (err) => {
                        //if (err) console.error(err);
                        if (err) return reject(err);

                        debug('SUCCESS');
                        resolve(true);
                    })
                })
            })
        })
    })
}

function createCache(module:string):Promise<string>{
    return new Promise((resolve, reject) => {
        tmp.dir({unsafeCleanup:true}, (err, path, cleanupCallback) => {
            if (err) return reject(err);
            ncp(module, path, (err) => {
                if (err) reject(err);
                exec('npm install', {cwd:path, env:process.env}, (err) => {
                    if (err) reject(err);
                    else resolve(path);
                })
            })
        })
    })
}

function testPeer(module:string, testCommand:string, peer:string):Promise<string[]>{

    const debug = _debug(`peers:peer:${peer}`);

    let versions:string[];
    return utils.getVersions(peer)
        .then(_versions => {
            versions = _versions;
            debug(`versions: ${versions.join(', ')}`);
            return createCache(module);
        })
        .then(cachePath => {
            debug(`cache at ${cachePath}`);
            return Promise.all(versions.map(version => {
                return testVersion(cachePath, peer, version, testCommand)
                    .then(() => [version])
                    .catch(err => [])
            }))
        })
        .then(results => {
            let validVersions:string[] = [];
            results.forEach(result => {
                validVersions = validVersions.concat(result);
            });
            debug(`valid versions: ${validVersions.join(', ')}`);
            return validVersions;
        })
}

/**
 * Determines valid versions of peer dependencies of a module.
 * @param module - The path to the module to test.
 * @param testCommand - The command to run with the module which will determine if the specific peer
 * dependency version is valid.
 */
function test(module:string, testCommand:string):Promise<{[peer:string]:string[]}>{

    //todo: figure out better way to expose path with nodejs/npm in it
    process.env.PATH = process.execPath.slice(0, -5) + ':' + process.env.PATH;

    const validPeerVersions:{[peer:string]:string[]} = {};

    return utils.getPeerDependencies(module)
        .then(peers => {
            debug(`peers: ${peers.join(', ')}`);
            return Promise.all(peers.map(peer => {
                return testPeer(module, testCommand, peer)
                    .then(validVersions => {
                        validPeerVersions[peer] = validVersions;
                    })
            }))
        })
        .then(() => validPeerVersions);
}

export = test;

//const modPath = path.join(__dirname, '../test/modules/mod1');
/**const modulePath = path.join(__dirname, '../foo');
process.env.PATH = process.execPath.slice(0, -5) + ':' + process.env.PATH;
test(modulePath, 'ls')
.then(result => {
    console.log(result);
})
    .catch(err => {
        console.log(err);
    });**/