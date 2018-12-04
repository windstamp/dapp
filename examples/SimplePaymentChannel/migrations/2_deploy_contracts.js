var SimplePaymentChannel = artifacts.require("./SimplePaymentChannel.sol");

module.exports = function(deployer, network, accounts) {
  var alice = accounts[0];
  var bob = accounts[1];
  var value = web3.toWei(0.003, 'ether');
  var duration = 10;

  deployer.deploy(SimplePaymentChannel, bob, duration, {from: alice, value: value});
};
