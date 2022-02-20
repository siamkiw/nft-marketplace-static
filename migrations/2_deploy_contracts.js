const NFTMarket = artifacts.require("NFTMarket");
const NFTFusion = artifacts.require("NFTFusion");
const NFT = artifacts.require("NFT");

module.exports = async function(deployer) {

    await deployer.deploy(NFTMarket)

    const NFTMarketContract = await NFTMarket.deployed()

    await deployer.deploy(NFT, NFTMarketContract.address)

    await deployer.deploy(NFTFusion, NFT.address, NFTMarket.address)

    const NFTContract = await NFTFusion.deployed()

    NFTMarketContract.updateApprovals(NFTFusion.address, true)

    const NFTFusionContract = await NFTFusion.deployed()


};