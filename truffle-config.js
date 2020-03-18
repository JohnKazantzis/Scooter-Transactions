const path = require("path");
//const mnemonic = 'empty choose rubber promote industry pause bone stamp token method surge lend';
//const HDWalletProvider = require("truffle-hdwallet-provider");


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    }
  }
};
