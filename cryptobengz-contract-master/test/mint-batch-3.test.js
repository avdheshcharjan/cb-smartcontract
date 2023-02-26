const { expect } = require('chai');
const { ethers } = require('hardhat');
const {CONTRACT_NAME} = require('../credentials.json');

describe('Batch 3 mint', async () => {
  let standard;
  beforeEach(async () => {
    const Standard = await ethers.getContractFactory(CONTRACT_NAME);
    standard = await Standard.deploy();
    await standard.deployed();
  });

  it('fails when public sale not active', async () => {
    await expect(
      standard.mintBatch3(1, {
        value: ethers.utils.parseEther('0.04'),
      }),
    ).to.be.revertedWith('Incorrect mint batch');
  });

  it('fails when not enough ether given', async () => {
    await standard.setCurrentMintBatch(3);
    await expect(
      standard.mintBatch3(1, {
        value: ethers.utils.parseEther('0.03'),
      }),
    ).to.be.revertedWith('Incorrect ether sent');
  });

  it('fails when exceeds max supply', async () => {
    await standard.setCurrentMintBatch(3);
    const maxSupply = await standard.MAX_SUPPLY();
    await standard.teamMint(maxSupply.toNumber());
    await expect(
      standard.mintBatch3(1, {
        value: ethers.utils.parseEther('0.06'),
      }),
    ).to.be.revertedWith('Max supply reached');
  });

  it('succesfully mints and records data', async () => {
    await standard.setCurrentMintBatch(3);
    await standard.mintBatch3(3, {
      value: ethers.utils.parseEther('0.18'),
    });
  });

  it("max mint 20 across all batches", async () => {
    const [owner] = await ethers.getSigners();
    await standard.setCurrentMintBatch(2);
    await standard.mintBatch2(10, {
      value: ethers.utils.parseEther('1'),
    });
    const balance = await standard.balanceOf(owner.address);
    await expect(balance).to.equal(20);

    await standard.setCurrentMintBatch(3);
    await expect(
      standard.mintBatch3(1, {
        value: ethers.utils.parseEther('0.06'),
      }),
    ).to.be.revertedWith("Exceeds Max Claim");
  })

  it("max mint 20 across all batches", async () => {
    const [owner] = await ethers.getSigners();
    await standard.setCurrentMintBatch(2);
    await standard.mintBatch2(8, {
      value: ethers.utils.parseEther('0.8'),
    });
    let balance = await standard.balanceOf(owner.address);
    await expect(balance).to.equal(16);

    await standard.setCurrentMintBatch(3);
    await expect(
      standard.mintBatch3(5, {
        value: ethers.utils.parseEther('0.3'),
      }),
    ).to.be.revertedWith("Exceeds Max Claim");

    balance = await standard.balanceOf(owner.address);
    await expect(balance).to.equal(16);

  })
});
