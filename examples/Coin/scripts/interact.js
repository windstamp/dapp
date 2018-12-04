var Web3 = require('web3');
var TruffleContract = require('truffle-contract');

const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const Coin = TruffleContract(require('../build/contracts/Coin.json'));
Coin.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

var asyncFunc = async function() {
    coin = await Coin.deployed();
    console.log('\n coin address: ', coin.address);
    console.log('\n minter address: ', await coin.minter());

    var coinbase = web3.eth.coinbase;
    var acc0 = web3.eth.accounts[0];
    var acc1 = web3.eth.accounts[1]

    console.log('\n coinbase address: ', coinbase);
    console.log('\n accounts[0] address: ', acc0);
    console.log('\n accounts[1] address: ', acc1);

    // result = await coin.mint(coinbase, 10000, {from: coinbase});
    // console.log('\n result: ', result);

    // balance = await coin.balances(coinbase);
    // console.log('\n coinbase balance: ', balance.toNumber());

    // balance = await coin.balances(acc1);
    // console.log('\n accounts[1] balance: ', balance.toNumber());

    result = await coin.send(acc1, 1000, {from: coinbase});
    // console.log('\n result: ', result);
    // result = await coin.send(web3.eth.accounts[1], 10, {'from': web3.eth.accounts[0]});
    // result = await coin.send(coinbase, 1, {from: coinbase});
    // result = await coin.send(coinbase, 1);
    // console.log('\n result: ', result);
};

asyncFunc();
