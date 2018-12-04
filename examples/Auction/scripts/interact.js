var sleep = require('sleep');
var TruffleContract = require('truffle-contract');
var Web3 = require('web3');

const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const SimpleAuction = TruffleContract(require('../build/contracts/SimpleAuction.json'));
SimpleAuction.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

// 需要每次执行前都重新
// truffle migrate --network local --reset
var asyncFunc = async function() {
    simpleAuction = await SimpleAuction.deployed();
    console.log('\n ballot address: ', simpleAuction.address);

    var acc0 = web3.eth.accounts[0];
    var acc1 = web3.eth.accounts[1];
    var acc2 = web3.eth.accounts[2];
    var acc3 = web3.eth.accounts[3];
    var acc4 = web3.eth.accounts[4];
    var acc5 = web3.eth.accounts[5];

    result = await simpleAuction.bid({from: acc1, value: 10000});
    console.log('\n result: ', result);
    
    result = await simpleAuction.bid({from: acc2, value: 20000});
    console.log('\n result: ', result);
    
    result = await simpleAuction.bid({from: acc3, value: 30000});
    console.log('\n result: ', result);
    
    result = await simpleAuction.bid({from: acc4, value: 40000});
    console.log('\n result: ', result);
    
    result = await simpleAuction.bid({from: acc5, value: 50000});
    console.log('\n result: ', result);
    
    sleep.sleep(10);

    // result = await simpleAuction.auctionEnd({from: acc0});
    result = await simpleAuction.auctionEnd({from: acc1});
    console.log('\n result: ', result);
};

asyncFunc();
