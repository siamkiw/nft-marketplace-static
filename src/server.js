const express = require('express')
const app = express()
const path = require('path');
const port = 3001

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/page/home.html'));
})

app.get('/create-nft', (req, res) => {
    res.sendFile(path.join(__dirname, '/page/createNFT.html'));
})

app.get('/my-nft', (req, res) => {
    res.sendFile(path.join(__dirname, '/page/myNFT.html'));
})

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/page/dashboard.html'))
})

app.get('/fusion', (req, res) => {
  res.sendFile(path.join(__dirname, '/page/fusion.html'))
})

// assume 404 since no middleware responded
app.use(function(req, res, next){
    res.status(404).sendFile(path.join(__dirname, '/page/pageNotFound.html'));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})