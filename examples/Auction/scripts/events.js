var Web3 = require('web3');
var TruffleContract = require('truffle-contract');

const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const SimpleAuction = TruffleContract(require('../build/contracts/SimpleAuction.json'));
SimpleAuction.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

var asyncFunc = async function() {
    simpleAuction = await SimpleAuction.deployed();
    console.log('\n address: ', simpleAuction.address);

    simpleAuction.HighestBidIncreased().watch(function(error, result) {
        if (error) {
            showError(error);
            
            return;
        }

        console.log("SimpleAuction bid: " + result.args.amount.toNumber() +
            " amount from: " + result.args.bidder + ".");
    });

    console.log('11111111111111');

    simpleAuction.AuctionEnded().watch(function(error, result) {
        if (error) {
            showError(error);
            
            return;
        }

        console.log("win : " + result.args.amount.toNumber() +
            " amount by: " + result.args.winner + ".");
    });
};

asyncFunc();
