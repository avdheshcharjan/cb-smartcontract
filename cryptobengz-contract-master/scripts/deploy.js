const hre = require("hardhat");
const { CONTRACT_NAME } = require("../credentials.json");

async function main() {
    const Standard = await hre.ethers.getContractFactory(CONTRACT_NAME);
    const standard = await Standard.deploy();

    await standard.deployed();

    console.log("Standard deployed to:", standard.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
