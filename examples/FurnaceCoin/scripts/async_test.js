var Web3 = require('web3');
var contract = require('truffle-contract');
var sleep = require('sleep');

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

var async_func_name = async function() {
    var result = await deployed.name();
    console.log("\nTest name:");
    console.log('name: ', result);
}

var async_func_symbol = async function() {
    var result = await deployed.symbol();
    console.log("\nTest symbol:");
    console.log('symbol: ', result);
}

var async_func_decimals = async function() {
    var result = await deployed.decimals();
    console.log("\nTest decimals:");
    console.log("decimals: ", result.toNumber());
}

var async_func_totalSupply = async function() {
    var result = await deployed.totalSupply();
    console.log("\nTest totalSupply_:");
    console.log("totalSupply_: ", result.toNumber());
}

var async_func_balanceOf = async function(desc, acc) {
    var result = await deployed.balanceOf(acc);
    console.log("\nTest", desc, ":");
    console.log(desc, ": ", result.toNumber());
}

var async_func_transfer = async function(to, value, sender) {
    var result = await deployed.transfer(to, value, {from: sender});
    console.log("\nTest transfer (sender:", sender, ", to:", to, ", value:", value, ").");
    console.log("transfer tx: ", result.tx);
}

var async_func_approve = async function(spender, value, sender) {
    var result = await deployed.approve(spender, value, {from: sender});
    console.log("\nTest approve (sender:", sender, ", spender:", spender, ", value:", value, ").");
    console.log("approve tx: ", result.tx);
}

var async_func_allowance = async function(owner, spender) {
    var result = await deployed.allowance(owner, spender);
    console.log("\nTest allowance (owner:", owner, ", spender:", spender, ").");
    console.log("value: ", result.toNumber());
}

var async_func_increaseApproval = async function(spender, value, sender) {
    var result = await deployed.increaseApproval(spender, value, {from: sender});
    console.log("\nTest increaseApproval (sender:", sender, ", spender:", spender, ", value:", value, ").");
    console.log("increaseApproval tx: ", result.tx);
}

var async_func_decreaseApproval = async function(spender, value, sender) {
    var result = await deployed.decreaseApproval(spender, value, {from: sender});
    console.log("\nTest decreaseApproval (sender:", sender, ", spender:", spender, ", value:", value, ").");
    console.log("decreaseApproval tx: ", result.tx);
}

var async_func_transferFrom = async function(from, to, value, sender) {
    var result = await deployed.transferFrom(from, to, value, {from: sender});
    console.log("\nTest transferFrom (sender:", sender, ", from:", from, ", to:", to, ", value:", value, ").");
    console.log("transferFrom tx: ", result.tx);
}

async_func_name();
async_func_symbol();
async_func_decimals();
async_func_totalSupply();
sleep.msleep(100);

async_func_balanceOf('balanceOfAcc0', acc0);
async_func_balanceOf('balanceOfAcc1', acc1);
sleep.msleep(100);

async_func_transfer(acc1, 1000, acc0);
sleep.msleep(100);

async_func_balanceOf('balanceOfAcc0', acc0);
async_func_balanceOf('balanceOfAcc1', acc1);
sleep.msleep(100);

async_func_approve(acc0, 1000, acc0);
async_func_allowance(acc0, acc0);
async_func_increaseApproval(acc0, 1000, acc0);
async_func_allowance(acc0, acc0);
async_func_decreaseApproval(acc0, 500, acc0);
async_func_allowance(acc0, acc0);
sleep.msleep(100);

async_func_transferFrom(acc0, acc1, 1000, {from: acc0});
sleep.msleep(100);

async_func_balanceOf('balanceOfAcc0', acc0);
async_func_balanceOf('balanceOfAcc1', acc1);