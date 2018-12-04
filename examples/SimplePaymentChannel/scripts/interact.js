var BN = require('bn.js');
var abi = require('ethereumjs-abi');
var ethereumjs = require('ethereumjs-util');
var Web3 = require('web3');
var TruffleContract = require('truffle-contract');

const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const SimplePaymentChannel = TruffleContract(require('../build/contracts/SimplePaymentChannel.json'));
SimplePaymentChannel.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

var constructPaymentMessage = function (contractAddress, amount) {
    return "0x" + abi.soliditySHA3(
        ["address", "uint256"],
        [contractAddress, amount]
    ).toString("hex");
}

var signMessage = async function (signer, message) {
    sig = web3.eth.sign(signer, "0x" + message.toString("hex"));

    return sig;
}

// contractAddress is used to prevent cross-contract replay attacks.
// amount, in wei, specifies how much Ether should be sent.
var signPayment = async function (signer, contractAddress, amount) {
    var message = constructPaymentMessage(contractAddress, amount);
    message = prefixed(message);
    var signature = await signMessage(signer, message);

    return {msg: message, sig: signature};
}

// this mimics the prefixing behavior of the eth_sign JSON-RPC method.
function prefixed(hash) {
    // return ethereumjs.ABI.soliditySHA3(
    return "0x" + abi.soliditySHA3(
        ["string", "bytes32"],
        ["\x19Ethereum Signed Message:\n32", hash]
    ).toString("hex");
}

function recoverSigner(message, signature) {
    var split = ethereumjs.Util.fromRpcSig(signature);
    var publicKey = ethereumjs.Util.ecrecover(message, split.v, split.r, split.s);
    var signer = ethereumjs.Util.pubToAddress(publicKey).toString("hex");
    return signer;
}

function isValidSignature(contractAddress, amount, signature, expectedSigner) {
    var message = prefixed(constructPaymentMessage(contractAddress, amount));
    var signer = recoverSigner(message, signature);
    return signer.toLowerCase() ==
        ethereumjs.Util.stripHexPrefix(expectedSigner).toLowerCase();
}

// 需要每次执行前都重新
// truffle migrate --network local --reset
var asyncFunc = async function() {
    var simplePaymentChannel = await SimplePaymentChannel.deployed();
    console.log('\n address: ', simplePaymentChannel.address);

    var acc0 = web3.eth.accounts[0];
    var acc1 = web3.eth.accounts[1];
    var acc2 = web3.eth.accounts[2];
    var acc3 = web3.eth.accounts[3];
    var acc4 = web3.eth.accounts[4];
    var acc5 = web3.eth.accounts[5];

    var alice = acc0;
    var bob = acc1;

    var contractAddress = simplePaymentChannel.address;

    var contractBalance = await web3.eth.getBalance(contractAddress);
    contractBalance = web3.fromWei(contractBalance, 'ether');
    console.log('\n contractBalance: ', contractBalance.toNumber());

    var amount = web3.toWei(0.0001, 'ether');
    console.log('\n amount: ', amount);
    var sigObj = await signPayment(alice, contractAddress, amount);
    console.log('\n sigObj: ', sigObj);
    var message = sigObj.msg;
    var signature = sigObj.sig;
    console.log('\n message: ', message);
    console.log('\n message length: ', message.length);
    console.log('\n signature: ', signature);
    console.log('\n signature length: ', signature.length);

    result = await simplePaymentChannel.close(amount, signature, {from: bob});
    console.log('\n result: ', result);

    var contractBalance = await web3.eth.getBalance(contractAddress);
    contractBalance = web3.fromWei(contractBalance, 'ether');
    console.log('\n contractBalance: ', contractBalance.toNumber());
};

asyncFunc();
