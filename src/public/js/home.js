let NFTContainer = document.getElementById('NFTContainer')

let rawItems = null
let items = []

async function initWeb3() {
    NFTMarketAbi = await onGetAbi("NFTMarket");
    NFTAbi = await onGetAbi("NFT");
    NFTFusionAbi = await onGetAbi("NFTFusion");
    await loadWeb3();
    await loadBlockchainData();
    await initHome()
}

async function initHome(){
    rawItems = await onGetMarketItems()
    renderMarketsItems(rawItems)
}

async function renderMarketsItems(data){

        items = await Promise.all(data.map(async i => {

            const tokenUri = await NFTContract.methods.tokenURI(i.tokenId).call()

            console.log(tokenUri)

            let response = await fetch(tokenUri, {
                method: "GET",
              });
              let meta = await response.json();

            const price = window.web3.utils.fromWei(i.price, 'ether')

            let item = {
              price,
              itemId: parseInt(i.itemId),
              seller: i.seller,
              owner: i.ownerAddress,
              image: meta.image,
              name: meta.name,
              description: meta.description,
            }
            return item
          }))

          for(let item of items){
              console.log('item : ', item)
            // add element to container   
              NFTContainer.innerHTML += `
                <div class="card me-3 mb-3" style="width: 18rem;">
                    <img src="${item.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title" id="NFTName">${item.name}</h5>
                        <p class="card-text" id="NFTDesc">${item.description}</p>
                        <p class="card-text" id="NFTPrice">${item.price} ETH</p>
                        <button class="btn btn-primary" id="buyNFTButton${item.itemId}">BUY NFT</button>
                    </div>
                </div>
              `
          }

          // add buy functon to button

          const NFTAddress = NFTAbi.networks[networkId].address

          for(let item of items){
            let buyButton =  document.getElementById(`buyNFTButton${item.itemId}`)
            const selectedItem = items.filter((i) => {return i.itemId === item.itemId})
            const price = window.web3.utils.toWei(selectedItem[0].price, 'Ether')


            buyButton.addEventListener('click', async function(){
                const account = await web3.eth.getAccounts();
                console.log('selectedItem : ', selectedItem)
                console.log('price : ', price)

                const createMarketSale = await NFTMarketContract.methods.createMarketSale(NFTAddress, item.itemId).send({from: account[0], value: price}).on('transactionHash', (hash) => {
                    console.log('on transactionHash createMarketSale')
                })
                console.log('createMarketSale : ', createMarketSale)
            })
          }
}

