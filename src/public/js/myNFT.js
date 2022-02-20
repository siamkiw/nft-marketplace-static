let NFTContainer = document.getElementById('NFTContainer')

let rawItems = null
let items = []

async function initWeb3() {
    NFTMarketAbi = await onGetAbi("NFTMarket");
    NFTAbi = await onGetAbi("NFT");
    NFTFusionAbi = await onGetAbi("NFTFusion");
    await loadWeb3();
    await loadBlockchainData();
    // await initMyNFT()

    // let items = await onGetMyNFTToken()
    // renderNFTTokens(items, NFTContainer)

    let items = await onGetMyNFTToken()
    console.log('onGetMyNFTToken : ', items)
    renderNFTTokens(items, NFTContainer)
}

async function renderNFTTokens(items, DOMElement){
  for(let item of items){
  // add element to container
  console.log("renderNFTTokens token : ", item)
  DOMElement.innerHTML += `
      <div class="card me-3 mb-3" style="width: 18rem;">
          <img src="${item.image}" class="card-img-top" alt="...">
          <div class="card-body">
              <h5 class="card-title" id="NFTName">Name : ${item.name}</h5>
              <p class="card-text" id="NFTDesc">Description : ${item.description}</p>
              <p class="card-text" id="NFTDesc">Owner : ${item.owner}</p>
          </div>
      </div>
    `
  }
}

async function initMyNFT(){
    rawItems = await onGetMyItems()
    console.log('rawItems : ',rawItems)
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
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        }
        return item
      }))


}