const { assert } = require("chai");

require("chai")
  .use(require("chai-as-promised"))
  .should();

const NFTMarket = artifacts.require("../contracts/NFTMarket.sol");
const NFT = artifacts.require("../contracts/NFT.sol");
const NFTFusion = artifacts.require("../contracts/NFTFusion.sol");

contract("NFTMarket", ([deployer, author, tipper]) => {
  let market, nft, fusion, NFTMarketAddress, NFTAddress, NFTFusionAddress;

  before(async () => {
    market = await NFTMarket.deployed();
    nft = await NFT.deployed(market.address);
    fusion = await NFTFusion.deployed(nft.address, market.address);
    market.updateApprovals(nft.address, true);
  });

  describe("deployment", (async) => {
    it("deploys NFTMarket successfully", async () => {
      NFTMarketAddress = await market.address;
      assert.notEqual(NFTMarketAddress, 0x0);
      assert.notEqual(NFTMarketAddress, "");
      assert.notEqual(NFTMarketAddress, null);
      assert.notEqual(NFTMarketAddress, undefined);
    });

    it("deploys NFT successfully", async () => {
      NFTAddress = await nft.address;
      assert.notEqual(NFTAddress, 0x0);
      assert.notEqual(NFTAddress, "");
      assert.notEqual(NFTAddress, null);
      assert.notEqual(NFTAddress, undefined);
    });

    it("deploys Fusion successfully", async () => {
      NFTFusionAddress = await fusion.address;
      assert.notEqual(NFTFusionAddress, 0x0);
      assert.notEqual(NFTFusionAddress, "");
      assert.notEqual(NFTFusionAddress, null);
      assert.notEqual(NFTFusionAddress, undefined);
    });
  });

  describe("Create and execute market sales.", async () => {
    let listingPrice, account;

    it("Should create and execute market sales", async function() {
      listingPrice = await market.getListingPrice();

      let auctionPrice = web3.utils.toWei("0.3", "Ether");

      await nft.createToken("https://www.mytokenlocation.com");
      await nft.createToken("https://www.mytokenlocation2.com");

      await market.createMarketItem(NFTAddress, 1, auctionPrice, {
        value: listingPrice,
      });
      await market.createMarketItem(NFTAddress, 2, auctionPrice, {
        value: listingPrice,
      });

      accounts = await web3.eth.getAccounts();
      const buyerAddress = accounts[1];
      console.log("getBalance 1 : ", await web3.eth.getBalance(buyerAddress));

      await market.createMarketSale(NFTAddress, 1, {
        from: buyerAddress,
        value: auctionPrice,
      });

      items = await market.fetchMarketItems();
      items = await Promise.all(
        items.map(async (i) => {
          const tokenUri = await nft.tokenURI(i.tokenId);
          let item = {
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.ownerAddress,
            tokenUri,
          };
          return item;
        })
      );

      console.log("items : ", items);
      console.log("tipper : ", tipper);
      console.log("getBalance 2 : ", await web3.eth.getBalance(buyerAddress));
    });
  });

  describe("Fusion token", async function() {

    it("Should check item thai is in market or not", async function() {
      // create token
      await nft.createToken("https://www.mytokenlocation3.com");
      await nft.createToken("https://www.mytokenlocation4.com");

      // create market item form token
      let auctionPrice = web3.utils.toWei("0.3", "Ether");
      let listingPrice = await market.getListingPrice();

      await market.createMarketItem(NFTAddress, 3, auctionPrice, {
        value: listingPrice,
      });
      await market.createMarketItem(NFTAddress, 4, auctionPrice, {
        value: listingPrice,
      });

      let marketItems = await market.fetchMarketItems();

      // marketItems = await Promise.all(
      //   items.map(async (i) => {
      //     const tokenUri = await nft.tokenURI(i.tokenId);
      //     let item = {
      //       price: i.price.toString(),
      //       tokenId: i.tokenId.toString(),
      //       seller: i.seller,
      //       owner: i.owner,
      //       tokenUri,
      //     };
      //     return item;
      //   })
      // );

      console.log("marketItems -> : ", marketItems)

    });

    // test nft marketplace isMarketItem 

    it("Should return true if tokenId is in marketplace.", async function(){

      let marketItems = await market.fetchMarketItems();

      marketItems = await Promise.all(
        items.map(async (i) => {
          const tokenUri = await nft.tokenURI(i.tokenId);
          let item = {
            price: i.price.toString(),
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            tokenUri,
          };
          return item;
        })
      );

      let inMarketplace =  await market.isMarketItem(marketItems[0].tokenId);

      let inNotMarketplace =  await market.isMarketItem(1);

      assert.equal(inMarketplace, true, "token is in market");
      
      assert.equal(inNotMarketplace, false, "token is not in market");

      console.log("inMarketplace :", inMarketplace)
    })

    it("Should create token and fusion between item", async function() {
      // create token
      await nft.createToken("https://www.mytokenlocation.com");
      await nft.createToken("https://www.mytokenlocation2.com");

      // create market item form token
      let auctionPrice = web3.utils.toWei("0.3", "Ether");
      let listingPrice = await market.getListingPrice();

      await market.createMarketItem(NFTAddress, 5, auctionPrice, {
        value: listingPrice,
      });
      await market.createMarketItem(NFTAddress, 6, auctionPrice, {
        value: listingPrice,
      });

      // buy item in market
      accounts = await web3.eth.getAccounts();
      const buyerAddress = accounts[0];

      await market.createMarketSale(NFTAddress, 5, {
        from: buyerAddress,
        value: auctionPrice,
      });
      await market.createMarketSale(NFTAddress, 6, {
        from: buyerAddress,
        value: auctionPrice,
      });

      // fusion token
      await fusion.fusionNFT(5, 6, "https://www.myNewFusionToken.com", {
        from: buyerAddress,
      });

      let myNfts = await nft.fetchMyNFTs({ from: buyerAddress });

      let fusionTokenId = myNfts[0].toNumber();

      let fusionTokenUrl = await nft.tokenURI(fusionTokenId);

      assert.equal(myNfts, 7);
      assert.equal(fusionTokenUrl, "https://www.myNewFusionToken.com");
    });

    it("Should create token and fusion between token", async function() {
      accounts = await web3.eth.getAccounts();
      const buyerAddress = accounts[0];

      // create token
      await nft.createToken("https://www.mytokenlocation.com", {
        from: buyerAddress,
      });
      await nft.createToken("https://www.mytokenlocation2.com", {
        from: buyerAddress,
      });

      let myRawNFTs = await nft.fetchMyNFTs({ from: buyerAddress })
      let myNFTS = []
      
      for(let nft of myRawNFTs){
        myNFTS.push(parseInt(nft.toString()))
      }

      console.log('myNFTS : ', myNFTS)

      // fusion token
      let fusionNFTRes = await fusion.fusionNFT(myNFTS[myNFTS.length - 1], myNFTS[myNFTS.length - 2], "https://www.myNewFusionToken2.com", {
        from: buyerAddress,
      });

      const fusionToken = fusionNFTRes.logs[0].args.itemId.toNumber()

      console.log('fusionToken : ', fusionToken)

      myRawNFTs = await nft.fetchMyNFTs({ from: buyerAddress });
      myNFTS = []

      for(let nft of myRawNFTs){
        myNFTS.push(parseInt(nft.toString()))
      }

      const fusionTokenURL = await nft.tokenURI(fusionToken);

      assert.equal(myNFTS.find(tokenId => tokenId === fusionToken), fusionToken);
      assert.equal(fusionTokenURL, "https://www.myNewFusionToken2.com");
    });
  });
});
