var Greeter = artifacts.require("./Greeter.sol");

module.exports = function(deployer) {
  deployer.deploy(Greeter);
};
