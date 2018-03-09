import getVersions = require('../../src/utils/getVersions');

test('should get correct versions', async() => {
    const versions = await getVersions('@shreyjain1994/peers-test1');
    expect(versions).toEqual(['0.0.7', '0.0.8', '0.0.9']);
});