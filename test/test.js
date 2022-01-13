const { assert } = require('chai')

require('chai')
  .use(require('chai-as-promised'))
  .should()

const NFTMarket = artifacts.require('../contracts/NFTMarket.sol')
const NFT = artifacts.require('../contracts/NFT.sol')

contract('NFTMarket', ([deployer, author, tipper]) => {
    let market, nft, NFTMarketAddress, NFTAddress

    before(async () => {
        market = await NFTMarket.deployed()
        nft = await NFT.deployed(market.address)
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
                  owner: i.owner,
                  tokenUri
                }
                return item
              }))

            console.log('items : ', items)
            console.log('tipper : ', tipper)
            console.log("getBalance 2 : ", await web3.eth.getBalance(buyerAddress))
            
          })

          
        
    })
    
})