const hre = require("hardhat");
const { CONTRACT_NAME } = require("../credentials.json");
const { DEPLOYED_CONTRACT_ADDRESS, OPERATOR_ADDRESS, ACCOUNT_PRIVATE_KEY } = require("../credentials.json");
const send_abi = require("../contractABI.json");
const operator_abi = require("../operator_abi.json");
const addresses = require("../airdrop.json");
const test_addresses = require("../airdrop_testv2.json");


async function main() {

  let private_key = ACCOUNT_PRIVATE_KEY;
  let send_address = "0x643745a6656ca7673375E49ec7Ce0874018b3423"
  let contract_address = DEPLOYED_CONTRACT_ADDRESS
  let operator_address = OPERATOR_ADDRESS

  let wallet = new ethers.Wallet(private_key)
  const provider = new ethers.providers.JsonRpcProvider();
  let walletSigner = wallet.connect(provider)

  let contract = new ethers.Contract(
    contract_address,
    send_abi,
    walletSigner
  )

  let operator = new ethers.Contract(
    operator_address,
    operator_abi,
    walletSigner
  );

  // const isApproved = await contract.isApprovedForAll(send_address, OPERATOR_ADDRESS)
  // console.log(isApproved)

  // if (!isApproved) {
  //   await contract.setApprovalForAll(OPERATOR_ADDRESS, true)
  // }


  let i = 0;
  const chunk_address = test_addresses.address;
  const chunk_numTokens = test_addresses.balance;

  if (chunk_address.length != chunk_numTokens.length) {
    throw 'address and numTokens arrays are not the same length';
  }

  for await (const address_chunk of chunk_address) {
    console.log(i);
    try {
      const { gasLimit } = await operator.airdrop(
        address_chunk,
        chunk_numTokens[i],
        i,
      );
      console.log(gasLimit);
    } catch (err) {
      console.log(err)
      console.log('Unsuccessful');
    }
    i++;
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