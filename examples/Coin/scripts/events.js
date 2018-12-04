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
    console.log('\n address: ', coin.address);

    coin.Sent().watch({}, '', function(error, result) {
        if (error) {
            showError(error);
            
            return;
        }
    
        console.log("Coin transfer: " + result.args.amount +
            " coins were sent from " + result.args.from +
            " to " + result.args.to + ".");
        console.log("Balances now:\n" +
            "Sender: " + Coin.balances.call(result.args.from) +
            "Receiver: " + Coin.balances.call(result.args.to));
    });
};

asyncFunc();
