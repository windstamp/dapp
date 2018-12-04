var Web3 = require('web3');
var TruffleContract = require('truffle-contract');

const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const Ballot = TruffleContract(require('../build/contracts/Ballot.json'));
Ballot.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

// 需要每次执行前都重新
// truffle migrate --network local --reset
var asyncFunc = async function() {
    ballot = await Ballot.deployed();
    console.log('\n ballot address: ', ballot.address);

    var acc1 = web3.eth.accounts[1];
    var acc2 = web3.eth.accounts[2];
    var acc3 = web3.eth.accounts[3];
    var acc4 = web3.eth.accounts[4];
    var acc5 = web3.eth.accounts[5];

    result = await ballot.giveRightToVote(acc1, {from: web3.eth.coinbase});
    console.log('\n result: ', result);

    result = await ballot.giveRightToVote(acc2, {from: web3.eth.coinbase});
    console.log('\n result: ', result);

    result = await ballot.giveRightToVote(acc3, {from: web3.eth.coinbase});
    console.log('\n result: ', result);

    result = await ballot.giveRightToVote(acc4, {from: web3.eth.coinbase});
    console.log('\n result: ', result);

    result = await ballot.giveRightToVote(acc5, {from: web3.eth.coinbase});
    console.log('\n result: ', result);

    result = await ballot.vote(1, {from: acc1});
    console.log('\n result: ', result);

    result = await ballot.vote(1, {from: acc2});
    console.log('\n result: ', result);

    result = await ballot.vote(1, {from: acc3});
    console.log('\n result: ', result);

    result = await ballot.vote(1, {from: acc4});
    console.log('\n result: ', result);

    result = await ballot.vote(1, {from: acc5});
    console.log('\n result: ', result);

    result = await ballot.winningProposal();
    console.log('\n result: ', result.toNumber());

    result = await ballot.winnerName();
    console.log('\n result: ', result);
};

asyncFunc();
