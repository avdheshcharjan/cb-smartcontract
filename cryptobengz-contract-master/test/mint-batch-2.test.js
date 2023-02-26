const { expect } = require('chai');
const { ethers } = require('hardhat');
const {CONTRACT_NAME} = require('../credentials.json');

describe('Batch 2 mint', async function () {
  let standard;

  beforeEach(async () => {
    const Standard = await ethers.getContractFactory(CONTRACT_NAME);
    standard = await Standard.deploy();
    await standard.deployed();
    const [owner] = await ethers.getSigners();
  });

  it('fails before batch 2 turns to active', async () => {
    await expect(standard.mintBatch2(1)).to.be.revertedWith(
      'Incorrect mint batch',
    );
  });

  it('fails when order is not in multiples of 2', async () => {
    await standard.setCurrentMintBatch(2);
    await expect(
      standard.mintBatch2(1, {
        value: ethers.utils.parseEther('0.06'),
      }),
    ).to.be.revertedWith('Must order in multiples of 2');
  });

  it('fails transaction if not enough ether', async () => {
    await standard.setCurrentMintBatch(2);
    await expect(
      standard.mintBatch2(2, {
        value: ethers.utils.parseEther('0.09'),
      }),
    ).to.be.revertedWith('Incorrect ether sent');
  });

  it('fails when max supply reached', async () => {
    await standard.setCurrentMintBatch(2);
    const maxSupply = await standard.MAX_SUPPLY();
    await standard.teamMint(maxSupply.toNumber());
    await expect(
      standard.mintBatch2(2, {
        value: ethers.utils.parseEther('0.12'),
      }),
    ).to.be.revertedWith('Max supply reached');
  });

  it('mints total of 4 NFTs when order is 2', async () => {
    const [owner] = await ethers.getSigners();
    await standard.setCurrentMintBatch(2);
    standard.mintBatch2(2, {
      value: ethers.utils.parseEther('0.12'),
    });
    const balance = await standard.balanceOf(owner.address);
    await expect(balance).to.equal(4);
  });
});
