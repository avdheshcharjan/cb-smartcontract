const { expect } = require('chai');
const { ethers } = require('hardhat');
const {CONTRACT_NAME} = require('../credentials.json');

const setNotRevealedURI =
  'ipfs://QmXZGWhQp3CQc3svnDhUuf4yTtoQBuqumHeC33jmEG69Dd/hidden.json';
const baseURI = 'ipfs://QmXmncGeCEtmv5K8w4dCQ48tyDavquoHiBsS4GWqaFLgMf/';

describe('tokenURI', async function () {
  let standard;
  beforeEach(async () => {
    const Standard = await ethers.getContractFactory(CONTRACT_NAME);
    standard = await Standard.deploy();
    await standard.deployed();
    await standard.setCurrentMintBatch(3);
  });

  it('if isRevealed is false, return hidden uri', async () => {
    await standard.setNotRevealedURI(setNotRevealedURI);
    await standard.setBaseURI(baseURI);

    await standard.mintBatch3(1, {
      value: ethers.utils.parseEther('0.06'),
    }),
      (tokenURI = await standard.tokenURI(1));
    expect(tokenURI).to.be.equals(setNotRevealedURI);
  });

  it('if isRevealed is true, return revealed uri', async () => {
    await standard.setIsRevealed(true);
    await standard.setNotRevealedURI(setNotRevealedURI);
    await standard.setBaseURI(baseURI);

    await standard.mintBatch3(1, {
      value: ethers.utils.parseEther('0.06'),
    });
    const id = 1;
    const tokenURI = await standard.tokenURI(id);
    expect(tokenURI).to.be.equals(baseURI + id + '.json');
  });

  it('if token does not exist, return error that token does not exist', async () => {
    await standard.setIsRevealed(true);
    await standard.setNotRevealedURI(setNotRevealedURI);
    await standard.setBaseURI(baseURI);

    await standard.mintBatch3(1, {
      value: ethers.utils.parseEther('0.06'),
    });
    const id = 5;
    await expect(standard.tokenURI(id)).to.be.revertedWith(
      'ERC721aMetadata: URI query for nonexistent token',
    );
  });
});
