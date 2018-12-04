var Web3 = require('web3');
var TruffleContract = require('truffle-contract');

const rpcUrl = 'http://localhost:7545'

const provider = new Web3.providers.HttpProvider(rpcUrl);
const web3 = new Web3(provider);

const BlindAuction = TruffleContract(require('../build/contracts/BlindAuction.json'));
BlindAuction.setProvider(provider);

const showError = error => {
    console.error('\n error:', error);
};

var asyncFunc = async function() {
    blindAuction = await BlindAuction.deployed();
    console.log('\n address: ', blindAuction.address);

    blindAuction.AuctionEnded().watch(function(error, result) {
        if (error) {
            showError(error);
            
            return;
        }

        console.log("win : " + result.args.highestBid.toNumber() +
            " amount by: " + result.args.winner + ".");
    });
};

asyncFunc();
