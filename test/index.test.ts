import peers = require('../src/index');
import path = require('path');

const modPath = path.join(__dirname, 'modules/mod1');

test('should work', async() => {
    const actual = await peers(modPath, 'npm run test1');
    const expected = {
        "@shreyjain1994/peers-test1":['0.0.7', '0.0.8', '0.0.9']
    };
    expect(actual).toEqual(expected);
});

test('should work 2', async() => {
    const actual = await peers(modPath, 'npm run test2');
    const expected = {
        "@shreyjain1994/peers-test1":['0.0.8', '0.0.9']
    };
    expect(actual).toEqual(expected);
});

test('should work 3', async() => {
    const actual = await peers(modPath, 'npm run test3');
    const expected = {
        "@shreyjain1994/peers-test1":['0.0.9']
    };
    expect(actual).toEqual(expected);
});