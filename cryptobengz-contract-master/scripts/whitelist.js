const hre = require("hardhat");
const { CONTRACT_NAME } = require("../credentials.json");
const { DEPLOYED_CONTRACT_ADDRESS } = require("../credentials.json");
const { wl1, wl2 } = require("../cb_whitelist.json");

async function main() {
    const Standard = await hre.ethers.getContractFactory(CONTRACT_NAME);
    const standard = await Standard.attach(DEPLOYED_CONTRACT_ADDRESS);

    await standard.setWhitelistAddress(wl1, 1);
    await standard.setWhitelistAddress(wl2, 1);
    console.log("Whitelist addresses set");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
