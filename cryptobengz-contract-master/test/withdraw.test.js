const { expect } = require('chai');
const { formatEther } = require('ethers/lib/utils');
const { ethers } = require('hardhat');
const {CONTRACT_NAME} = require('../credentials.json');

describe("Test withdraw functionality", async function () {
  let standard;

  beforeEach(async () => {
    const Standard = await ethers.getContractFactory(CONTRACT_NAME);
    standard = await Standard.deploy();
    await standard.deployed();
  });

  it("fails when not owner", async () => {
    const [owner, addr1] = await ethers.getSigners();
    await expect(standard.connect(addr1).withdraw(ethers.utils.parseEther("0.06"))).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });

  it("fails when no ether in contract", async () => {
    const [owner] = await ethers.getSigners();
    await expect(standard.withdraw(ethers.utils.parseEther("0.06"))).to.be.revertedWith(
      "Address: insufficient balance"
    );
  });

  it("fails when artist address not set", async () => {
    const [owner, artist, addr1] = await ethers.getSigners();
    await standard.setCurrentMintBatch(3);
    await standard.connect(addr1).mintBatch3(1, {
      value: ethers.utils.parseEther("0.06")
    });
    await expect(standard.withdraw(ethers.utils.parseEther("0.06"))).to.be.revertedWith(
      "Artist address not set"
    );
  });

  it("withdraws ether from contract", async () => {
    const [owner, artist, addr1] = await ethers.getSigners();
    const old_owner_balance = await ethers.provider.getBalance(owner.address);
    await standard.setArtistAddress(artist.address)

    await standard.setCurrentMintBatch(3);
    await standard.connect(addr1).mintBatch3(1, {
      value: ethers.utils.parseEther('0.06'),
    });
    await standard.withdraw(ethers.utils.parseEther("0.06"));

    const new_owner_balance = await ethers.provider.getBalance(owner.address);
    const res = new_owner_balance.sub(old_owner_balance);
    expect(res).to.be.gt(0);

    const contract_balance = await ethers.provider.getBalance(standard.address);
    expect(contract_balance).to.be.eq(0);
  });

  it("withdraws 88% to contract owner and 12% to artist", async () => {
    const [owner, artist, addr1] = await ethers.getSigners();
    const old_owner_balance = await ethers.provider.getBalance(owner.address);
    const old_artist_balance = await ethers.provider.getBalance(artist.address);

    await standard.setArtistAddress(artist.address);

    await standard.setCurrentMintBatch(3);
    await standard.connect(addr1).mintBatch3(1, {
      value: ethers.utils.parseEther('0.06'),
    });
    await standard.withdraw(ethers.utils.parseEther("0.06"));

    const new_owner_balance = await ethers.provider.getBalance(owner.address);
    const new_artist_balance = await ethers.provider.getBalance(artist.address);

    const owner_res = new_owner_balance.sub(old_owner_balance);
    const artist_res = new_artist_balance.sub(old_artist_balance);

    expect(owner_res).to.be.gt(0);
    expect(artist_res).to.be.gt(0);
    expect(owner_res).to.be.gt(artist_res);

    const owner_res_num = Number(formatEther(owner_res.toString()));
    const artist_res_num = Number(formatEther(artist_res.toString()));
    expect(owner_res_num).to.be.closeTo(artist_res_num / 12 * 88, 0.001);

  });
});