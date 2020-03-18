var scooterTransactions = artifacts.require("./scooterTransactions.sol");

module.exports = function(deployer) {
  deployer.deploy(scooterTransactions);
};
