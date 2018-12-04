var BN = require('bn.js')
var abi = require('ethereumjs-abi')
var sleep = require('sleep');
var TruffleContract = require('truffle-contract');
var Web3 = require('web3');


const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const BlindAuction = TruffleContract(require('../build/contracts/BlindAuction.json'));
BlindAuction.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

var generateBlinedBid = function(value, fake, secret) {
    // secret = '123456';
    secret = web3.sha3(secret);
    // console.log('\n secret: ', secret);
    secret = secret.slice(2);
    // console.log('\n secret: ', secret);

    blindedBid = abi.soliditySHA3(
        [ "uint", "bool", "string" ],
        [ value, fake, secret]
    ).toString('hex')
    //console.log('\n blindedBid: ', blindedBid);

    return blindedBid;
}

// 需要每次执行前都重新
// truffle migrate --network local --reset
var asyncFunc = async function() {
    blindAuction = await BlindAuction.deployed();
    console.log('\n blindAuction address: ', blindAuction.address);

    var acc0 = web3.eth.accounts[0];
    var acc1 = web3.eth.accounts[1];
    var acc2 = web3.eth.accounts[2];
    var acc3 = web3.eth.accounts[3];
    var acc4 = web3.eth.accounts[4];
    var acc5 = web3.eth.accounts[5];

    var values = [];
    var fakes = [];
    var secrets = [];

    var value = 10000;
    var fake = false;
    var secret = '123456';
    blindedBid = generateBlinedBid(value, fake, secret);
    console.log('\n blindedBid: ', blindedBid);
    result = await blindAuction.bid(blindedBid, {from: acc1, value: value});
    console.log('\n result: ', result);
    values.push(value);
    fakes.push(fake);
    secrets.push(blindedBid);
    
    var value = 20000;
    var fake = true;
    var secret = '123456';
    blindedBid = generateBlinedBid(value, fake, secret);
    console.log('\n blindedBid: ', blindedBid);
    result = await blindAuction.bid(blindedBid, {from: acc1, value: value});
    console.log('\n result: ', result);
    values.push(value);
    fakes.push(fake);
    secrets.push(blindedBid);
    
    var value = 30000;
    var fake = false;
    var secret = '123456';
    blindedBid = generateBlinedBid(value, fake, secret);
    console.log('\n blindedBid: ', blindedBid);
    result = await blindAuction.bid(blindedBid, {from: acc1, value: value});
    console.log('\n result: ', result);
    values.push(value);
    fakes.push(fake);
    secrets.push(blindedBid);
    
    sleep.sleep(10);

    result = await blindAuction.reveal(values, fakes, secrets, {from: acc1});
    console.log('\n result: ', result);

    sleep.sleep(10);

    result = await blindAuction.auctionEnd({from: acc0});
    // result = await blindAuction.auctionEnd({from: acc1});
    console.log('\n result: ', result);
};

asyncFunc();
