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

console.log("Event Lister.");

var eventTransfer = deployed.Transfer();
var eventApproval = deployed.Approval();

eventTransfer.watch(function(error, result){
    if (error) {
        console.error(error);
        return;
    }
    
    console.log('\nEvent for Transfer:');
    console.log('transactionIndex: ', result.transactionIndex);
    console.log('transactionHash: ', result.transactionHash);
    console.log('blockHash: ', result.blockHash);
    console.log('blockNumber: ', result.blockNumber);
    console.log('addressOfFurnaceCoin: ', result.address);
    console.log('from: ', result.args.from);
    console.log('to: ', result.args.to);
    console.log('value: ', result.args.value.toNumber());
});

eventApproval.watch(function(error, result){
    if (error) {
        console.error(error);
        return;
    }
    
    console.log('\nEvent for Approval:');
    console.log('transactionIndex: ', result.transactionIndex);
    console.log('transactionHash: ', result.transactionHash);
    console.log('blockHash: ', result.blockHash);
    console.log('blockNumber: ', result.blockNumber);
    console.log('addressOfFurnaceCoin: ', result.address);
    console.log('owner: ', result.args.owner);
    console.log('spender: ', result.args.spender);
    console.log('value: ', result.args.value.toNumber());
});
