let NFTMarketAbi, NFTAbi, NFTFusionAbi;

let NFTMarketContract, NFTContract, NFTFusion, networkId;

async function onGetAbi(contractName) {
  let response = await fetch(`/contracts/${contractName}.json`, {
    method: "GET",
  });
  let result = await response.json();
  return result;
}

async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert("Non-Ethereum browser detected.");
  }
}

async function loadBlockchainData() {
  const web3 = window.web3;

  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  // NetWork ID
  // get network id form metamask that we are useing
  networkId = await web3.eth.net.getId();
  // get network data form json abi file by networkId
  const NFTMarketAbiNetworkData = NFTMarketAbi.networks[networkId];
  const NFTAbiNetworkData = NFTAbi.networks[networkId];
  const NFTFusionNetworkData = NFTFusionAbi.networks[networkId];

  // check is network is valid
  if (NFTMarketAbiNetworkData && NFTAbiNetworkData && NFTFusionNetworkData) {
    // connect to contract
    NFTMarketContract = new web3.eth.Contract(
      NFTMarketAbi.abi,
      NFTMarketAbiNetworkData.address
    );
    NFTContract = new web3.eth.Contract(NFTAbi.abi, NFTAbiNetworkData.address);

    NFTFusionContract = new web3.eth.Contract(NFTFusionAbi.abi, NFTFusionNetworkData.address)

    console.log("NFTMarketContract : ", NFTMarketContract.methods);
    console.log("NFTContract : ", NFTContract.methods);
    console.log("NFTFusion : ", NFTFusionContract.methods)
  } else {
    window.alert("Contract not deployed to detected network.");
    return 
  }

  if(!NFTMarketContract || !NFTContract || !NFTFusionContract){
    window.alert("Contract not deployed to detected network.");
    return 
  }

  console.log("Contract deployed to network.")

}

async function onGetMarketItems(){
    const items = await NFTMarketContract.methods.fetchMarketItems().call()
    console.log("items : ", items)
    return items
}

async function onGetMyItems(){
    const accounts = await web3.eth.getAccounts();
  console.log(accounts);

    const items = await NFTMarketContract.methods.fetchMyNFTs().call({from: accounts[0]})
    console.log("items : ", items)
    return items
}

async function onGetMyCreatedItems(){
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    const items = await NFTMarketContract.methods.fetchItemsCreated().call({from: accounts[0]})
    console.log("items : ", items)
    return items

}

async function onCreateItem(dataURL){

    const account = await web3.eth.getAccounts();

    let NFTTransaction = await NFTContract.methods.createToken(dataURL).send({from: account[0]}).on('transactionHash', (hash) => {
        console.log('on transactionHash NFTTransaction')
    })

    console.log('NFTTransaction : ', NFTTransaction)

    const NFTAddress = NFTAbi.networks[networkId].address
    const NFTTokenID = NFTTransaction.events.Transfer.returnValues.tokenId
    const NFTPrice = window.web3.utils.toWei(priceNFT.value, 'Ether')
    let listingPrice = await NFTMarketContract.methods.getListingPrice().call()
    listingPrice = listingPrice.toString()

    let marketNFTTransaction = await NFTMarketContract.methods.createMarketItem(NFTAddress, NFTTokenID, NFTPrice).send({from: account[0], value: listingPrice}).on('transactionHash', (hash) => {
        console.log('on transactionHash marketNFTTransaction')
    })

    console.log('marketNFTTransaction : ', marketNFTTransaction)
}


async function onFusionItem(baseItemId, ingredientItemId){

  const account = await web3.eth.getAccounts();

  const NFTAddress = NFTAbi.networks[networkId].address

  let NFTFusionTransaction = await NFTFusionContract.methods.fusionNFT(baseItemId, ingredientItemId, "https://ipfs.infura.io/ipfs/QmSiXrNuNDvbeXjJsyiuy8R3GdtDKePQSTqiu7RhhV8TBb").send({from: account[0]}).on('transactionHash', (hash) => {
    console.log('on transactionHash NFTFusionTransaction')
})  

console.log("NFTFusionTransaction : ", NFTFusionTransaction)
}


async function onGetMyNFTToken(){
  const accounts = await web3.eth.getAccounts();
  
  let itemIds = await NFTContract.methods.fetchMyNFTs().call({from: accounts[0]})
  let items = []

  for(let itemId of itemIds){
    const tokenUri = await NFTContract.methods.tokenURI(itemId).call()

    let response = await fetch(tokenUri, {
      method: "GET",
    });
    let meta = await response.json();
    meta.owner = accounts[0]
    items.push(meta)
  }

  return items

}

async function onDeleteMarketItem(marketId){
  const accounts = await web3.eth.getAccounts();
  const NFTAddress = NFTAbi.networks[networkId].address
  const deleteMarketIdTransaction = await NFTMarketContract.methods.deleteMarketItem(NFTAddress, marketId).send({from: accounts[0]})
  console.log("deleteMarketIdTransaction : ", deleteMarketIdTransaction)
  // return marketId
}