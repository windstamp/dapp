var Web3 = require('web3');
var contract = require('truffle-contract');

const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(provider);

const MetaCoin = contract(require('../build/contracts/MetaCoin.json'));
MetaCoin.setProvider(provider);

var metaCoin;
const GAS = 1000000;

var address = web3.eth.accounts[0];

const showError = error => {
    console.error(error);
};

MetaCoin.new({ from: address, gas: GAS }).then(instance => {
    metaCoin = instance;

    console.log('address', instance.address);
    console.log('txhash', instance.transactionHash);
}).catch(showError);
