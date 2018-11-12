var FurnaceCoin = artifacts.require("./FurnaceCoin.sol");

module.exports = function(deployer) {
    var initSupply = 3000000000;
    
    deployer.deploy(FurnaceCoin, initSupply);
};
