var Ballot = artifacts.require("./Ballot.sol");

module.exports = function(deployer) {
    var proposalNames = [web3.toHex("China"), web3.toHex("English"), web3.toHex("British"), web3.toHex("American")];

    deployer.deploy(Ballot, proposalNames);
};
