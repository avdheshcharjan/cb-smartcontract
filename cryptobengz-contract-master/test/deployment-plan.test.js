const { expect } = require('chai');
const { ethers } = require('hardhat');
const {CONTRACT_NAME} = require('../credentials.json');


describe('Deployment plan', async function () {
  it('deploys', async () => {
    const Standard = await ethers.getContractFactory(CONTRACT_NAME);
    const standard = await Standard.deploy();
    await standard.deployed();
    const provider = ethers.provider;

    const [owner, artist, address1, address2, address3] = await ethers.getSigners();
    // Team mint
    await standard.teamMint(77);

    await standard.setNotRevealedURI('url');
    await standard.setBaseURI('base_url');

    // Batch 1
    await standard.setCurrentMintBatch(1);
    await standard.connect(address1).mintBatch1(3, {
      value: ethers.utils.parseEther('0.12'),
    });

    // Batch 2
    await standard.setCurrentMintBatch(2);
    await standard.connect(address2).mintBatch2(2, {
      value: ethers.utils.parseEther('0.24'),
    });

    // Batch 3
    await standard.setCurrentMintBatch(3);
    await standard.connect(address3).mintBatch3(3, {
      value: ethers.utils.parseEther('0.18'),
    });

    // Withdraw
    await standard.setArtistAddress(artist.address)
    var old_owner_balance = await provider.getBalance(owner.address);
    await standard.withdraw(ethers.utils.parseEther("0.34"));
    var new_owner_balance = await provider.getBalance(owner.address);

    const res = new_owner_balance.sub(old_owner_balance);
    expect(res).to.be.gt(0);
  });
});
