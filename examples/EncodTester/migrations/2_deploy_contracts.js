var EncodeTester = artifacts.require("./EncodeTester.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(EncodeTester);
};
