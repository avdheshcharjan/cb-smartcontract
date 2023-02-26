require('@nomiclabs/hardhat-waffle');
require("hardhat-gas-reporter");
require('hardhat-abi-exporter');

const {
  ETHERSCAN_API_KEY,
  COINMARKETCAP_API_KEY,
  ACCOUNT_PRIVATE_KEY,
  NETWORK_URL,
  MAINNET_NETWORK_URL,
} = require('./credentials.json');
require('@nomiclabs/hardhat-etherscan');
require('solidity-coverage');
require('hardhat-abi-exporter');


task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {},
    goerli: {
      url: NETWORK_URL,
      accounts: [ACCOUNT_PRIVATE_KEY],
      gasMultiplier: 2,
    },
    mainnet: {
      url: MAINNET_NETWORK_URL,
      accounts: [ACCOUNT_PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 21,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  abiExporter: {
    path: './data/abi',
    runOnCompile: true,
  }
};

