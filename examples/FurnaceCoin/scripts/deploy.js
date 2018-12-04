var Web3 = require('web3');
var contract = require('truffle-contract');

const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(provider);

const FurnaceCoin = contract(require('../build/contracts/FurnaceCoin.json'));
FurnaceCoin.setProvider(provider);

let myContract = null;
const GAS = 4700000;

var address = web3.eth.accounts[0];

const showError = error => {
    console.error(error);
};

FurnaceCoin.new(100000000, { from: address, gas: GAS }).then(instance => {
    myContract = instance;

    console.log('address', instance.address);
    console.log('txhash', instance.transactionHash);
}).catch(showError);
