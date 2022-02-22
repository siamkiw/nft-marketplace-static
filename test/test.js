const { assert } = require('chai')

require('chai')
  .use(require('chai-as-promised'))
  .should()

const NFTMarket = artifacts.require('../contracts/NFTMarket.sol')
const NFT = artifacts.require('../contracts/NFT.sol')
const NFTFusion = artifacts.require('../contracts/NFTFusion.sol')


contract('NFTMarket', ([deployer, author, tipper]) => {
    let market, nft, fusion, NFTMarketAddress, NFTAddress, NFTFusionAddress

    before(async () => {
        market = await NFTMarket.deployed()
        nft = await NFT.deployed(market.address)
        fusion = await NFTFusion.deployed(nft.address, market.address)
        market.updateApprovals(nft.address, true)
      })

    describe('deployment', async => {
        it('deploys NFTMarket successfully', async () => {
            NFTMarketAddress = await market.address
            assert.notEqual(NFTMarketAddress, 0x0)
            assert.notEqual(NFTMarketAddress, '')
            assert.notEqual(NFTMarketAddress, null)
            assert.notEqual(NFTMarketAddress, undefined)
          })


          it('deploys NFT successfully', async () => {
            NFTAddress = await nft.address
            assert.notEqual(NFTAddress, 0x0)
            assert.notEqual(NFTAddress, '')
            assert.notEqual(NFTAddress, null)
            assert.notEqual(NFTAddress, undefined)
          })

          it('deploys Fusion successfully', async () => {
            NFTFusionAddress = await fusion.address
            assert.notEqual(NFTFusionAddress, 0x0)
            assert.notEqual(NFTFusionAddress, '')
            assert.notEqual(NFTFusionAddress, null)
            assert.notEqual(NFTFusionAddress, undefined)
          })
    })

    describe("Create and execute market sales.", async () => {

        let listingPrice, account

          it("Should create and execute market sales", async function(){

            listingPrice = await market.getListingPrice()

            let auctionPrice = web3.utils.toWei('0.3', 'Ether')
            
            await nft.createToken("https://www.mytokenlocation.com")
            await nft.createToken("https://www.mytokenlocation2.com")

            await market.createMarketItem(NFTAddress, 1, auctionPrice, { value: listingPrice })
            await market.createMarketItem(NFTAddress, 2, auctionPrice, { value: listingPrice })

            accounts = await web3.eth.getAccounts();
            const buyerAddress = accounts[1]
            console.log("getBalance 1 : ", await web3.eth.getBalance(buyerAddress))

            await market.createMarketSale(NFTAddress, 1, { from : buyerAddress, value: auctionPrice})

            items = await market.fetchMarketItems()
            items = await Promise.all(items.map(async i => {
                const tokenUri = await nft.tokenURI(i.tokenId)
                let item = {
                  price: i.price.toString(),
                  tokenId: i.tokenId.toString(),
                  seller: i.seller,
                  owner: i.ownerAddress,
                  tokenUri
                }
                return item
              }))

            console.log('items : ', items)
            console.log('tipper : ', tipper)
            console.log("getBalance 2 : ", await web3.eth.getBalance(buyerAddress))
            
          })

          
        
    })

    describe("Fusion token", async function(){

      it("Should create token and fusion between token", async function(){
        
        // create token 
        await nft.createToken("https://www.mytokenlocation.com")
        await nft.createToken("https://www.mytokenlocation2.com")
        
        // create market item form token
        let auctionPrice = web3.utils.toWei('0.3', 'Ether')
        let listingPrice = await market.getListingPrice()

        let baseTokenId = 3
        let baseItemId = 3
        let ingredientTokenId = 4
        let ingredientItemId = 4

        await market.createMarketItem(NFTAddress, baseTokenId, auctionPrice, { value: listingPrice })
        await market.createMarketItem(NFTAddress, ingredientTokenId, auctionPrice, { value: listingPrice })

        // buy item in market
        accounts = await web3.eth.getAccounts();
        const buyerAddress = accounts[0]

        await market.createMarketSale(NFTAddress, baseItemId, { from : buyerAddress, value: auctionPrice})
        await market.createMarketSale(NFTAddress, ingredientItemId, { from : buyerAddress, value: auctionPrice})

        // fusion token
          // transfer token to fusion contract 
        // await nft.transferFrom(buyerAddress, NFTFusionAddress, baseTokenId, { from : buyerAddress})
        // await nft.transferFrom(buyerAddress, NFTFusionAddress, ingredientTokenId, { from : buyerAddress})

        // create fusion token
        // await fusion.fusionNFT(baseTokenId, ingredientTokenId, "https://www.mytokenlocation.com", { from : buyerAddress})

        let myNfts = await nft.fetchMyNFTs({from : buyerAddress})

        for(let val of myNfts){
          console.log(val.toNumber())
        }

        items = await market.fetchMyNFTs({ from : buyerAddress})
        // items = await Promise.all(items.map(async i => {
        //   const tokenUri = await nft.tokenURI(i.tokenId)
        //   let item = {
        //     price: i.price.toString(),
        //     tokenId: i.tokenId.toString(),
        //     seller: i.seller,
        //     owner: i.ownerAddress,
        //     tokenUri
        //   }
        //   return item
        // }))

        // console.log('items : ', items)

      })

    })
    
})