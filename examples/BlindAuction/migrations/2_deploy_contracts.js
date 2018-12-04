var BlindAuction = artifacts.require("./BlindAuction.sol");

module.exports = function(deployer, network, accounts) {
  var biddingTime = 10;
  var revealTime = 10;
  var beneficiary = accounts[0];

  deployer.deploy(BlindAuction, biddingTime, revealTime, beneficiary);
};
