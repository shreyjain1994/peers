import path = require('path');
import fs = require('fs');

/**
 * Gets the peer dependencies listed in the package.json file of a module.
 * @param modPath - The path to the module on the file-system.
 */
function getPeerDependencies(modPath:string):Promise<string[]>{
    const packageJsonPath:string = path.join(modPath, 'package.json');
    return new Promise((resolve, reject) => {
        fs.readFile(packageJsonPath, (err, packageJson)=>{
            let parsedPackageJson:any;
            if (err) return reject (err);
            try{
                parsedPackageJson = JSON.parse(packageJson.toString());
                resolve(Object.keys(parsedPackageJson.peerDependencies || {}))
            }
            catch(err){
                reject(err);
            }
        })
    })
}

export = getPeerDependencies;