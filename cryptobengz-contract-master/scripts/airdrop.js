const hre = require("hardhat");
const { CONTRACT_NAME } = require("../credentials.json");
const { DEPLOYED_CONTRACT_ADDRESS, ACCOUNT_PRIVATE_KEY } = require("../credentials.json");
const send_abi = require("../contractABI.json");
const addresses = require("../airdrop.json");
const test_addresses = require("../airdrop_test.json");


async function main() {

  let private_key = ACCOUNT_PRIVATE_KEY;
  let send_address = "0x643745a6656ca7673375E49ec7Ce0874018b3423"
  let contract_address = DEPLOYED_CONTRACT_ADDRESS

  test_addresses.forEach(async (obj) => {

    await send_token(
      contract_address,
      obj.address,
      private_key
    )
  });


  async function send_token(
    contract_address,
    to_address,
    private_key
  ) {
    let wallet = new ethers.Wallet(private_key)
    const provider = new ethers.providers.JsonRpcProvider();
    let walletSigner = wallet.connect(provider)


    if (contract_address) {

      let contract = new ethers.Contract(
        contract_address,
        send_abi,
        walletSigner
      )

      await contract.transferFrom(send_address, to_address, 1)
      console.log(`Sent 1 token to ${to_address}`);
    }
  }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


    // 89 264 units of gas for 1 trf

    // 1 unit of gas costs $0.00003266usd
    // 34634432 units of gas costs $1,133.33usd