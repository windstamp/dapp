var ReceiverPays = artifacts.require("./ReceiverPays.sol");

module.exports = function(deployer, network, accounts) {
  var alice = accounts[0];
  var bob = accounts[1];
  var value = web3.toWei(0.003, 'ether');

  deployer.deploy(ReceiverPays, {from: alice, value: value});
};
