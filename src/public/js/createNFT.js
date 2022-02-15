const ipfs = window.IpfsHttpClient

// selete element 
let nameNFT = document.getElementById('nameNFT')
let descriptionNFT = document.getElementById('descriptionNFT')
let priceNFT = document.getElementById('priceNFT')
let imageNFT = document.getElementById('imageNFT')
let previewImage = document.getElementById('previewImage')
let createNFTButton = document.getElementById('createNFTButton')
let warnningLable = document.getElementById('warnningLable')

warnningLable.style.display = 'none'
createNFTButton.disabled = true

async function initWeb3() {
    NFTMarketAbi = await onGetAbi("NFTMarket");
    NFTAbi = await onGetAbi("NFT");
    NFTFusionAbi = await onGetAbi("NFTFusion");
    await loadWeb3();
    await loadBlockchainData();    
    await initCreateNFT()
}

const ipfsObject = ipfs.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

let imageURL = ''
let dataURL = ''

async function initCreateNFT(){
    // add function to image input 
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

            createNFTButton.disabled = false

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

    createNFTButton.addEventListener('click', async function(){
        await onCreateItem(dataURL)
        window.location.href = '/'
    })


}



