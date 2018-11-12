var Web3 = require('web3');
var contract = require('truffle-contract');

//var rpcUrl = "http://localhost:7545";
var rpcUrl = "http://192.168.60.12:7545";

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const FurnaceCoin = contract(require('../build/contracts/FurnaceCoin.json'));
FurnaceCoin.setProvider(provider);

const showError = error => {
    console.error(error);
};

var addressOfFurnaceCoin = "0xbefd2d3f950f0e948bd0bef1f03f84636185c09c";
var deployed = FurnaceCoin.at(addressOfFurnaceCoin);

var accounts = web3.eth.accounts;
var acc0, balanceOfAcc0;
var acc1, balanceOfAcc1;
var acc2, balanceOfAcc2;
var acc3, balanceOfAcc3;
var acc4, balanceOfAcc4;

if (accounts.length > 0)
    acc0 = web3.eth.accounts[0];

if (accounts.length > 1)
    acc1 = web3.eth.accounts[1];

if (accounts.length > 2)
    acc2 = web3.eth.accounts[2];

if (accounts.length > 3)
    acc3 = web3.eth.accounts[3];

if (accounts.length > 4)
    acc4 = web3.eth.accounts[4];

var async_func_transfer = async function(to, value, sender) {
    var result = await deployed.transfer(to, value, {from: sender});
    console.log("\nTest transfer (sender:", sender, ", to:", to, ", value:", value, ").");
    console.log("transfer tx: ", result.tx);
}

async_func_transfer(acc1, 1000, acc0);
