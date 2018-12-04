var Web3 = require('web3');
var TruffleContract = require('truffle-contract');

const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const Purchase = TruffleContract(require('../build/contracts/Purchase.json'));
Purchase.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

// 需要每次执行前都重新
// truffle migrate --network local --reset
var asyncFunc = async function() {
    purchase = await Purchase.deployed();
    console.log('\n address: ', purchase.address);

    console.log('\n value: ', (await purchase.value()).toNumber());
    console.log('\n seller: ', await purchase.seller());
    console.log('\n buyer: ', await purchase.buyer());

    var acc0 = web3.eth.accounts[0];
    var acc1 = web3.eth.accounts[1];
    var acc2 = web3.eth.accounts[2];
    var acc3 = web3.eth.accounts[3];
    var acc4 = web3.eth.accounts[4];
    var acc5 = web3.eth.accounts[5];

    result = await purchase.abort({from: acc0});
    console.log('\n result: ', result);
};

asyncFunc();
