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

console.log("Test FurnaceCoin.");
deployed.then(function() {
    return deployed.name();
})
.then(function(result) {
    console.log("\nTest name:");
    console.log("name: ", result);

    return deployed.symbol();
})
.then(function(result) {
    console.log("\nTest symbol:");
    console.log("symbol: ", result);

    return deployed.decimals();
})
.then(function(result) {
    console.log("\nTest decimals:");
    console.log("decimals: ", result.toNumber());

    return deployed.INITIAL_SUPPLY();
})
.then(function(result) {
    console.log("\nTest INITIAL_SUPPLY:");
    console.log("INITIAL_SUPPLY: ", result.toNumber());

    return deployed.totalSupply();
})
.then(function(result) {
    console.log("\nTest totalSupply_:");
    console.log("totalSupply_: ", result.toNumber());

    return deployed.balanceOf(acc0);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc0:");
    console.log("balanceOfAcc0: ", result.toNumber());

    balanceOfAcc0 = result.toNumber();

    return deployed.balanceOf(acc1);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc1:");
    console.log("balanceOfAcc1: ", result.toNumber());

    balanceOfAcc1 = result.toNumber();

    return deployed.transfer(acc1, 1000, {from: acc0});
})
.then(function(result) {
    console.log("\nTest transfer:");
    console.log("transfer tx: ", result.tx);

    return deployed.balanceOf(acc0);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc0:");
    console.log("balanceOfAcc0: ", result.toNumber());

    balanceOfAcc0 = result.toNumber();

    return deployed.balanceOf(acc1);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc1:");
    console.log("balanceOfAcc1: ", result.toNumber());

    balanceOfAcc1 = result.toNumber();

    return deployed.approve(acc0, 3000, {from: acc0});
})
.then(function(result) {
    console.log("\nTest approve:");
    console.log("approve tx: ", result.tx);

    return deployed.allowance(acc0, acc0);
})
.then(function(result) {
    console.log("\nTest allowance:");
    console.log("allowance: ", result.toNumber());

    return deployed.increaseApproval(acc0, 1000, {from: acc0});
})
.then(function(result) {
    console.log("\nTest increaseApproval:");
    console.log("increaseApproval tx: ", result.tx);

    return deployed.allowance(acc0, acc0);
})
.then(function(result) {
    console.log("\nTest allowance:");
    console.log("allowance: ", result.toNumber());

    return deployed.decreaseApproval(acc0, 500, {from: acc0});
})
.then(function(result) {
    console.log("\nTest decreaseApproval:");
    console.log("decreaseApproval tx: ", result.tx);

    return deployed.allowance(acc0, acc0);
})
.then(function(result) {
    console.log("\nTest allowance:");
    console.log("allowance: ", result.toNumber());

    return deployed.transferFrom(acc0, acc1, 1000, {from: acc0});
})
.then(function(result) {
    console.log("\nTest transferFrom:");
    console.log("transferFrom tx: ", result.tx);

    return deployed.balanceOf(acc0);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc0:");
    console.log("balanceOfAcc0: ", result.toNumber());

    balanceOfAcc0 = result.toNumber();

    return deployed.balanceOf(acc1);
})
.then(function(result) {
    console.log("\nTest balanceOfAcc1:");
    console.log("balanceOfAcc1: ", result.toNumber());

    balanceOfAcc1 = result.toNumber();
})
.catch(showError);

// console.log("Test FurnaceCoin.");

// console.log("\ntest name.");
// // var result = deployed.name();
// // console.log('name: ', result);

// deployed.name().then(function(result) {
//     console.log('name: ', result);
// }).catch(showError);

// console.log("\ntest symbol.");
// // var result = deployed.symbol();
// // console.log('symbol: ', result);

// deployed.symbol().then(function(result) {
//     console.log('symbol: ', result);
// }).catch(showError);




