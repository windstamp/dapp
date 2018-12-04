var BN = require('bn.js')
var abi = require('ethereumjs-abi')
var Web3 = require('web3');
var TruffleContract = require('truffle-contract');

const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const ReceiverPays = TruffleContract(require('../build/contracts/ReceiverPays.json'));
ReceiverPays.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

// recipient is the address that should be paid.
// amount, in wei, specifies how much ether should be sent.
// nonce can be any unique number to prevent replay attacks
// contractAddress is used to prevent cross-contract replay attacks
var signPayment = async function(sender, recipient, amount, nonce, contractAddress) {
    var hash = "0x" + abi.soliditySHA3(
        ["address", "uint256", "uint256", "address"],
        [recipient, amount, nonce, contractAddress]
    ).toString("hex");

    // msg = await web3.eth.personal.sign(hash, sender);
    msg = await web3.eth.sign(sender, hash);

    return msg;
}

// 需要每次执行前都重新
// truffle migrate --network local --reset
var asyncFunc = async function() {
    var receiverPays = await ReceiverPays.deployed();
    console.log('\n address: ', receiverPays.address);

    // console.log('\n value: ', (await receiverPays.value()).toNumber());
    // console.log('\n balance: ', (await receiverPays.balance()).toNumber());
    // console.log('\n owner: ', await receiverPays.owner());

    var acc0 = web3.eth.accounts[0];
    var acc1 = web3.eth.accounts[1];
    var acc2 = web3.eth.accounts[2];
    var acc3 = web3.eth.accounts[3];
    var acc4 = web3.eth.accounts[4];
    var acc5 = web3.eth.accounts[5];

    var alice = acc0;
    var bob = acc1;

    var nonce = 0;
    var contractAddress = receiverPays.address;

    var contractBalance = await web3.eth.getBalance(contractAddress);
    contractBalance = web3.fromWei(contractBalance, 'ether');
    console.log('\n contractBalance: ', contractBalance.toNumber());

    var amount = web3.toWei(0.0001, 'ether');
    console.log('\n amount: ', amount);
    nonce += 1;
    var signature = await signPayment(alice, bob, amount, nonce, contractAddress);
    console.log('\n signature: ', signature);
    console.log('\n signature length: ', signature.length);
    // signature = signature.slice(2);
    // console.log('\n signature: ', signature);
    // console.log('\n signature length: ', signature.length);

    result = await receiverPays.claimPayment(amount, nonce, signature, {from: bob});
    console.log('\n result: ', result);

    var contractBalance = await web3.eth.getBalance(contractAddress);
    contractBalance = web3.fromWei(contractBalance, 'ether');
    console.log('\n contractBalance: ', contractBalance.toNumber());

    result = await receiverPays.kill({from: alice});
    console.log('\n result: ', result);

    var contractBalance = await web3.eth.getBalance(contractAddress);
    contractBalance = web3.fromWei(contractBalance, 'ether');
    console.log('\n contractBalance: ', contractBalance.toNumber());

};

asyncFunc();
