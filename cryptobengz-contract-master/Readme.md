# CryptoBengz Smart Contract

## Requirements
You need a credentials.json file that has the following params
```json
{
    "ETHERSCAN_API_KEY":"YOUR_API_KEY",
    "COINMARKETCAP_API_KEY":"YOUR_API_KEY",
    "ACCOUNT_PRIVATE_KEY":"YOUR_WALLET_ADDRESS_PRIVATE_KEY",
    "NETWORK_URL": "ALCHEMY_URL_ENDPOINT",
    "MAINNET_NETWORK_URL": "ALCHEMY_URL_ENDPOINT_FOR_MAINNET",
    "CONTRACT_NAME" : "THE_CONTRACT_NAME_YOU_WANT"
}
```

useful commands:
```bash
npx hardhat node
npx hardhat compile

npx hardhat run --network goerli scripts/deploy.js
npx hardhat run --network mainnet scripts/deploy.js

npx hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS

npx hardhat console --network goerli
npx hardhat console --network localhost
```

## Contract Rules
- ERC721A standard
- Phase 1 minting is gated by whitelist that should be updated before mint
- Phase 1 minting is input a quanity and receive quanitity * 2 NFTs, input price will be 0.04 eth for 1 which will get 1 free
- Phase 2 minting is open to everyone but is limited to 15 mints per wallet in phase 2
- Phase 2 minting forces you to buy in multiples of 2, which will get you additional 2 free NFTs. For quantity input only accepts multiples of 2, if you input quantity 2, you will pay 0.12 eth and receive a total of 4 NFTs
- Phase 3 minting is open to everyone but is limited to 15 mints per wallet in phase 3. The minted counter is phase specific, NFTs minted by a wallet in phase 2 is not remembered / carried over to the the mint count of the same wallet in phase 3.
- Phase 3 price is 0.06 eth for 1 NFT, no other special requirements

## Gas summary estimates
To read the gas charts and understand how to estimate gas per function call
- 1 gwei = 10^-9 ether
- contract deployment costs 2,559,071 gas units
- if gas price is 21 gwei
- contract deployment costs 2,559,071 gas units * 21 gwei = 4155785 * 21 * 10^-9 = 0.05374049 ether

![Gas Summary](/images/gas_summary.png "Gas summary")


