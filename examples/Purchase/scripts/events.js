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

    purchase.Aborted().watch(function(error, result) {
        if (error) {
            showError(error);
            
            return;
        }

        console.log('\n Aborted: ', result);
    });
    
    purchase.PurchaseConfirmed().watch(function(error, result) {
        if (error) {
            showError(error);
            
            return;
        }

        console.log('\n PurchaseConfirmed: ', result);
    });
    
    purchase.ItemReceived().watch(function(error, result) {
        if (error) {
            showError(error);
            
            return;
        }

        console.log('\n ItemReceived: ', result);
    });
};

asyncFunc();
