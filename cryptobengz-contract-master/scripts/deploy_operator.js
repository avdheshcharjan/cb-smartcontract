const hre = require("hardhat");

async function main() {
    const Standard = await hre.ethers.getContractFactory("CBAirdropper");
    const standard = await Standard.deploy();

    await standard.deployed();

    console.log("Operator deployed to:", standard.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
