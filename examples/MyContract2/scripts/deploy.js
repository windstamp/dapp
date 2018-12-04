var Web3 = require('web3');
var contract = require('truffle-contract');

//var Web3 = require('../node_modules/web3/dist/web3.min.js');
//var contract = require('../node_modules/truffle-contract/dist/truffle-contract.min.js');

const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(provider);

const MyContract = contract(require('../build/contracts/MyContract.json'));
MyContract.setProvider(provider);

let myContract = null;
const GAS = 1000000;

var address = web3.eth.accounts[0];

const showError = error => {
    console.error(error);
};

MyContract.new({ from: address, gas: GAS }).then(instance => {
    myContract = instance;

    console.log('address', instance.address);
    console.log('txhash', instance.transactionHash);
  }).catch(showError);
