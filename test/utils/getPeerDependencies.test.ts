import getPeerDependencies = require('../../src/utils/getPeerDependencies');
import path = require('path');

test('should get correct peer dependencies', async() => {
   const modulePath = path.join(__dirname, '../modules/mod1');
   const peers = await getPeerDependencies(modulePath);
   expect(peers).toEqual(['@shreyjain1994/peers-test1']);
});