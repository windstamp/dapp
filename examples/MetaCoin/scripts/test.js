var Web3 = require('web3');
var contract = require('truffle-contract');

const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(provider);

// Require the package that was previosly saved by truffle-artifactor
const MetaCoin = contract(require('../build/contracts/MetaCoin.json'));

// Remember to set the Web3 provider (see above).
MetaCoin.setProvider(provider);

// In this scenario, two users will send MetaCoin back and forth, showing
// how truffle-contract allows for easy control flow.
var account_one = web3.eth.accounts[0];
var account_two = web3.eth.accounts[0];

// Note our MetaCoin contract exists at a specific address.
var contract_address = "0x86ace2507faa91e412b760a97d48e4523ce07091";
var coin;

MetaCoin.at(contract_address).then(function(instance) {
  coin = instance;

  // Make a transaction that calls the function `sendCoin`, sending 3 MetaCoin
  // to the account listed as account_two.
  return coin.sendCoin(account_two, 3, {from: account_one});
}).then(function(result) {
  // This code block will not be executed until truffle-contract has verified
  // the transaction has been processed and it is included in a mined block.
  // truffle-contract will error if the transaction hasn't been processed in 120 seconds.

  // Since we're using promises, we can return a promise for a call that will
  // check account two's balance.
  return coin.balances.call(account_two);
}).then(function(balance_of_account_two) {
  // alert("Balance of account two is " + balance_of_account_two + "!"); // => 3
  console.log("Balance of account two is " + balance_of_account_two + "!"); // => 3

  // But maybe too much was sent. Let's send some back.
  // Like before, will create a transaction that returns a promise, where
  // the callback won't be executed until the transaction has been processed.
  return coin.sendCoin(account_one, 1.5, {from: account_two});
}).then(function(result) {
  // Again, get the balance of account two
  return coin.balances.call(account_two)
}).then(function(balance_of_account_two) {
  // alert("Balance of account two is " + balance_of_account_two + "!") // => 1.5
  console.log("Balance of account two is " + balance_of_account_two + "!") // => 1.5
}).catch(function(err) {
  // Easily catch all errors along the whole execution.
  // alert("ERROR! " + err.message);
  console.log("ERROR! " + err.message);
});
