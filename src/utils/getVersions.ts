import packageJson = require('package-json');

/**
 * Fetches all versions of a module on the npm registry.
 * @param mod - The module name on the npm registry.
 */
function getVersions(mod:string):Promise<string[]>{
    return packageJson(mod, {allVersions:true})
        .then((json:any) => {
            return Object.keys(json.versions);
        });
}

export = getVersions;