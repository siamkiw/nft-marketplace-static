let NFTContainer = document.getElementById('NFTContainer')

let rawItems = null
let items = []

async function initWeb3() {
    NFTMarketAbi = await onGetAbi("NFTMarket");
    NFTAbi = await onGetAbi("NFT");
    NFTFusionAbi = await onGetAbi("NFTFusion");
    await loadWeb3();
    await loadBlockchainData();
    await initMyNFT();
}


async function initMyNFT(){
    rawItems = await onGetMyItems()
    console.log('fetchMyNFTs rawItems : ',rawItems)
    renderMyItems(rawItems)
}

async function renderMyItems(data){
    items = await Promise.all(data.map(async i => {
        console.log("i : ", i)
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
          tokenId: parseInt(i.tokenId),
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
                  <h5 class="card-title" id="NFTName">Name : ${item.name}</h5>
                  <p class="card-text" id="NFTMarketId">Market ID : ${item.itemId}</p>
                  <p class="card-text" id="NFTTokenId">Token ID : ${item.tokenId}</p>
                  <p class="card-text" id="NFTDesc">${item.description}</p>
                  <p class="card-text" id="NFTPrice">${item.price} ETH</p>
                  <p class="card-text" >Owner : ${item.owner}</p>
                  <p class="card-text" >Seller : ${item.seller}</p>
              </div>
          </div>
        `
    }

}