var SimpleAuction = artifacts.require("./SimpleAuction.sol");

module.exports = function(deployer, network, accounts) {
  var biddingTime = 10;
  var beneficiary = accounts[0];

  deployer.deploy(SimpleAuction, biddingTime, beneficiary);
};
