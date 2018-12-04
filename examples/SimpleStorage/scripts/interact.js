var Web3 = require('web3');
var TruffleContract = require('truffle-contract');

const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const SimpleStorage = TruffleContract(require('../build/contracts/SimpleStorage.json'));
SimpleStorage.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

var asyncFunc = async function() {
    simpleStorage = await SimpleStorage.deployed();
    console.log('\n address: ', simpleStorage.address);

    storedData = await simpleStorage.get();
    console.log('\n storedData: ', storedData);

    result = await simpleStorage.set(33, {from: web3.eth.coinbase});
    console.log('\n result: ', result);

    storedData = await simpleStorage.get();
    console.log('\n storedData: ', storedData);
};

asyncFunc();
