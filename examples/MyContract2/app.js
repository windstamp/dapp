import $ from 'jquery';
import Web3 from 'web3';
import contract from 'truffle-contract';

const provider = new Web3.providers.HttpProvider("http://localhost:7545");
const web3 = new Web3(provider);

// Set up contracts APIs
const MyContract = contract(require('./build/contracts/MyContract.json'));
MyContract.setProvider(provider);

// Default variables
let myContract = null; 
const GAS = 1000000;                 // amount of gas to use for the transaction

// Function to show an error message
const showError = error => {
  console.error(error);
  $("#errors").text(error);
};

// Function that should be called every time we do a transaction to add it to the list
const addTransaction = txHash => $('#transactions-list').append(`<p><a href="#" class="transaction">${txHash}</a></p>`);

// We will use this function to show the status of our accounts, their balances and amount of tokens
const synchAccounts = () => {
  $('#default-account').html(`<b>Default Account: ${web3.eth.defaultAccount}</b>`);
  $('#accounts').html("");
  web3.eth.accounts.forEach(account => {
    let balance = web3.eth.getBalance(account);
    if (!myContract)
      $('#accounts').append(`<p><a href="#" class="deploy">Deploy MyContract</a> <span class="address">${account}</span> | <span class="balance">ETH ${balance}</span></p>`);
    else
      $('#accounts').append(`<p><span class="address">${account}</span> | <span class="balance">ETH ${balance}</span></p>`);
  });
};

// We will use this function in order to deploy MyToken contract from an owner account. We will use it just once
const deployMyContract = event => {
  event.preventDefault();
  let address = $(event.target).siblings(".address").text();
  MyContract.new({ from: address, gas: GAS }).then(instance => {
    myContract = instance;
    $('#mycontract-address').html(`<b>MyContract Address: ${instance.address}</b>`);
    addTransaction(instance.transactionHash);
    synchAccounts();
  }).catch(showError);
};

// Every time we click a transaction we will look for its details into the blockchain
const updateTransactionInfo = event => {
  event.preventDefault();
  let transactionHash = $(event.target).text();
  web3.eth.getTransaction(transactionHash, function(error, transactionInfo) {
    if(error) showError(error);
    else {
      $("#transaction-info").find("#hash").text(transactionInfo.hash);
      $("#transaction-info").find("#nonce").text(transactionInfo.nonce);
      $("#transaction-info").find("#block-hash").text(transactionInfo.blockHash);
      $("#transaction-info").find("#block-number").text(transactionInfo.blockNumber);
      $("#transaction-info").find("#gas-usage").text(transactionInfo.gas);
      $("#transaction-info").find("#transaction-index").text(transactionInfo.transactionIndex);
      $("#transaction-info").find("#from").text(transactionInfo.from);
      $("#transaction-info").find("#to").text(transactionInfo.to);
      $("#transaction-info").find("#value").text(transactionInfo.value);
    }
  });
};

// Show initial accounts state and initialize callback triggers
synchAccounts();
$(document).on('click', '.deploy', e => deployMyContract(e));
$(document).on('click', '.transaction', e => updateTransactionInfo(e));
