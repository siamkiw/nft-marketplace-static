let tokenId1, tokenId2

const ipfs = window.IpfsHttpClient

// selete element 
let nameNFT = document.getElementById('nameNFT')
let descriptionNFT = document.getElementById('descriptionNFT')
let priceNFT = document.getElementById('priceNFT')
let imageNFT = document.getElementById('imageNFT')
let previewImage = document.getElementById('previewImage')
let fusionNFTButton = document.getElementById('fusionNFTButton')
let warnningLable = document.getElementById('warnningLable')

warnningLable.style.display = 'none'
fusionNFTButton.disabled = true

const ipfsObject = ipfs.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


let imageURL = ''
let dataURL = ''

async function initWeb3() {
    NFTMarketAbi = await onGetAbi("NFTMarket");
    NFTAbi = await onGetAbi("NFT");
    NFTFusionAbi = await onGetAbi("NFTFusion");
    await loadWeb3();
    await loadBlockchainData();
    let items = await onGetMyNFTToken()
    renderNFTTokens(items, NFTContainer)
    initFusion()
}

async function renderNFTTokens(items, DOMElement){
  for(let item of items){
  // add element to container
  console.log("renderNFTTokens token : ", item)
  DOMElement.innerHTML += `
      <div class="card me-3 mb-3" style="width: 18rem;">
          <img src="${item.image}" class="card-img-top" alt="...">
          <div class="card-body">
              <h5 class="card-title" id="NFTName-${item.tokenId}">Name : ${item.name}</h5>
              <p class="card-text" id="NFTTokenId">Token Id : ${item.tokenId}</p>
              <p class="card-text" id="NFTDesc">Description : ${item.description}</p>
              <p class="card-text" id="NFTDesc">Owner : ${item.owner}</p>
          </div>
      </div>
    `
  }
}

function initFusion(){
  const idInput1 = document.querySelector('#itemId1')
  const idInput2 = document.querySelector('#itemId2')
  
  idInput1.addEventListener('keyup', function(){
    tokenId1 = parseInt(idInput1.value)
    console.log('tokenId1 : ', tokenId1)
  })
  
  idInput2.addEventListener('keyup', function(){
    tokenId2 = parseInt(idInput2.value)
    console.log('tokenId2 : ', tokenId2)
  })

  imageNFT.addEventListener('change', async function(){
    if (this.files && this.files[0]) {
        previewImage.onload = () => {
            URL.revokeObjectURL(previewImage.src);  // no longer needed, free memory
        }

        // upload image to ipfs
        const resImage = await ipfsObject.add(
            this.files[0],
            {
              progress: (prog) => console.log(`received: ${prog}`)
            }
          )

          imageURL = `https://ipfs.infura.io/ipfs/${resImage.path}`

          console.log('url : ', imageURL)

        previewImage.src = imageURL; 

        // upload nft data to ipfs

        if(!nameNFT.value || !descriptionNFT.value || !priceNFT.value || !imageNFT.value){
            console.log('Data is empty!')
            warnningLable.style.display = 'block'
            return
        }

        fusionNFTButton.disabled = false

        const data = JSON.stringify({
            name : nameNFT.value,
            description : descriptionNFT.value,
            image: imageURL
          })

        // upload image to ipfs
        const resNFT = await ipfsObject.add(
            data,
            {
              progress: (prog) => console.log(`received: ${prog}`)
            }
          )

        dataURL = `https://ipfs.infura.io/ipfs/${resNFT.path}`

        console.log('resNFT : ', dataURL)
    }
})
  
  
  document.querySelector('#fusionNFTButton').addEventListener('click', function() {
      onFusionItem(tokenId1, tokenId2, dataURL)
  })
  
}


