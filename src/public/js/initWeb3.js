let NFTMarketAbi, NFTAbi;

let NFTMarketContract, NFTContract, networkId;

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

  // check is network is valid
  if (NFTMarketAbiNetworkData && NFTAbiNetworkData) {
    // connect to contract
    NFTMarketContract = new web3.eth.Contract(
      NFTMarketAbi.abi,
      NFTMarketAbiNetworkData.address
    );
    NFTContract = new web3.eth.Contract(NFTAbi.abi, NFTAbiNetworkData.address);

    console.log("NFTMarketContract : ", NFTMarketContract.methods);
    console.log("NFTContract : ", NFTContract.methods);
  } else {
    window.alert("Contract not deployed to detected network.");
    return 
  }

  if(!NFTMarketContract || !NFTContract){
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

