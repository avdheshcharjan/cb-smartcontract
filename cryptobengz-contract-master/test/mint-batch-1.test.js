const { expect } = require('chai');
const { ethers } = require('hardhat');
const {CONTRACT_NAME} = require('../credentials.json');

describe('Batch 1 mint', async function () {
  let standard;

  beforeEach(async () => {
    const Standard = await ethers.getContractFactory(CONTRACT_NAME);
    standard = await Standard.deploy();
    await standard.deployed();
    const [owner] = await ethers.getSigners();
  });

  it('fails before presale turns to active', async () => {
    await expect(standard.mintBatch1(1)).to.be.revertedWith(
      'Incorrect mint batch',
    );
  });

  it('fails if exceed total supply', async () => {
    await standard.setCurrentMintBatch(1);
    const maxSupply = await standard.MAX_SUPPLY();
    await standard.teamMint(maxSupply.toNumber());
    await expect(
      standard.mintBatch1(1, {
        value: ethers.utils.parseEther('0.04'),
      }),
    ).to.be.revertedWith('Max supply reached');
  });

  it('fails transaction if not enough ether', async () => {
    await standard.setCurrentMintBatch(1);
    await expect(
      standard.mintBatch1(1, {
        value: ethers.utils.parseEther('0.01'),
      }),
    ).to.be.revertedWith('Incorrect ether sent');
  });

  it('mints', async () => {
    // add address and quantity to mapping variable accessList
    const [owner, address1] = await ethers.getSigners();

    await standard.setCurrentMintBatch(1);

    standard.mintBatch1(1, {
      value: ethers.utils.parseEther('0.04'),
    });
  });

  it('mints one, and then multiple later should pass too', async () => {
    const [owner] = await ethers.getSigners();

    await standard.setCurrentMintBatch(1);

    await standard.mintBatch1(1, {
      value: ethers.utils.parseEther('0.04'),
    });

    await standard.mintBatch1(1, {
      value: ethers.utils.parseEther('0.04'),
    });
  });

  it('prevents mint from batch 2', async () => {
    const [owner] = await ethers.getSigners();

    await standard.setCurrentMintBatch(1);
    await standard.mintBatch1(1, {
      value: ethers.utils.parseEther('0.04'),
    });
    expect(
      standard.mintBatch2(1, {
        value: ethers.utils.parseEther('0.04'),
      }),
    ).to.be.revertedWith('Incorrect mint batch');
  });
});
