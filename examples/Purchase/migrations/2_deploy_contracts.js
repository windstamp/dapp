var Purchase = artifacts.require("./Purchase.sol");

module.exports = function(deployer, network, accounts) {
  var seller = accounts[0];
  var value = 16;

  deployer.deploy(Purchase, {from: seller, value: value});
};
