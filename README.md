# NFT Marketplace Fusion Token with NodeJs

## Function เเละ เป้าหมายของ  Project

- สร้างตลาดสำหรับซื้อขาย NFT
- สามารถสร้าง NFT ขึ้นมาได้
- อัพโหลดข้อมูลของ NFT ไปที่ IPFS ( protocol and peer-to-peer network for storing data ) เเละ ข้อมูลบน blockchain
- fusion token ระหว่างสอง token

## Init Project

```
npm install -g truffle
```

เมื่อลงเสร็จเเล้วสามารถเช็ดได้ว่าเราได้ทำการ install สำเร็จหรือไม่ ผ่านคำสั่ง

```
truffle -v
```

![truffleCheckVersion](./image/truffleCheckVersion.png)

หากทำการ install สำเร็จผลลัพท์จะออกจามรูป

หลังจากนั้นสร้าง folder ปล่าวขึ้นมาสำหรับทำโปรเจค

```
mkdir nft-marketplace-server-doc
```

จากนั้นเข้าไปที่ folder ที่สร้างขึ้นมา

```
cd nft-marketplace-server-doc
```

เเล้วทำการ init project ขึ้นมาผ่าน npm

```
npm init -y
```

![initProject](./image/initProject.png)

สร้าง folder src เพื่อเก็บไฟล์ต่างๆของ Project

```
mkdir src

cd src

mkdir page & mkdir js
```

จากนั้นจะได้โครงสร้าง floder ตามรูปภาพ

![folder](./image/floder.png)

หลังจากสร้างเสร็จเเล้วให้กลับไปที่ root ของ project

```
cd ..

truffle init
```

![folder](./image/folder2.png)

หลังจาก run คำสั่งเเล้วตัว truffle จะทำการสร้าง folder ให้ 3 folder

- folder contracts ใช้สำหรับเขียนไฟล์ solidity

- folder migrations ใช้สำหรับเขียน script เพื่อ deploy ขึ้น blockchain

- folder test ใช้สำหรับเขียน test สำหรับ smart contract

\*\*\*สำคัญมาก ตัว smart contract deploy ไปเเล้วไม่สามารถเเก้ไข้ได้ ทำได้เเค่การ deploy contract อันใหม่ขึ้นไปเเทนเท่านั้น

## Install Dependencies ที่ต้องใช้ใน Project

```
npm install @openzeppelin/contracts chai chai-as-promised express
```

- @openzeppelin/contracts ใช้สำหรับคุณสมบัติของ class ที่เขียนตามมาตรฐาน ERC20 เเละ ERC721 ที่ทาง openzeppelin ได้เขียนไว้มาใช้
- chai เเละ chai-as-promised ใช้สำหรับเขียน test ของ smart contract
- express ใช้สำหรับสร้าง server

## สร้าง File Smart Contract (.sol)

สร้าง file smart contract (.sol) 5 ไฟล์ ใน folder contract

NFT.sol ใช้สำหรับ เขียน contract สำหรับ NFT

NFTMarket.sol ใช้สำหรับ เขียน contract สำหรับ ซื้อขาย nft ที่ถูกสร้างขึ้น

NFTFusion.sol ใช้สำหรับเป็นตัวกลางในการจัดการ NFT และ marketplace ในการ fusion ระหว่างสอง token

INFT.sol เป็น infterface สำหรับเรียกใช้งานคำสั่งจากอีก contract ผ่าน interface

Owner.sol เป็น contract สำหรับบอกว่าใครเป็นเจ้าของ contract และใครบ้านที่สามารถเรียกใช้งาน function ของ owner หรือว่า approvals ได้

## Flow Chart การทำงานของ Application

แต่ละสีแทนการเรียกใช้งาน contract ในแต่ละครั้ง ซึ้งการที่เรานั้นใช้งานได้หลาย contract ในการ call function หนึ่งครั้ง เป็นเพราะเราสามารถเรียกใช้งาน function ของอีก contract ได้ภายใน contract หลักที่เราได้ทำการเรียกใช้าน

![FlowChart](./image/flowchart.png)

## NFT.sol

![NFT](./image/NFT1.png)

Counter เป็น object ที่ใช้ในการเพิ่มลบจำนวนของ id มี function ย่อย 3 function ได้เเก้ increment() current() decrement() ซึ้งเราจะนำมาใช้เป็น type ของ ตัวแปล \_tokenIds เพื่อใช้ track id ของ token

\_burnToken เป็น mapping ที่เก็บค่า uint256 กับ bool เพื่อใช้ track ว่า token ไหนที่เราได้ทำการ burn ไปแล้ว

โดย constructor ของ contract นี้จะรับ address ของ marketplaceAddress เป็น parameter ซึ้งเราจะใช้ address นี้ในการใช้งาน setApprovalForAll เพื่อให้ contract marketplace สามารถเรียกใช้งาน function ของ contract NFT ที่จำเป็นต้องอยู่ในรายการที่ผ่านการ approve แล้วเท่านั้น

function createToken สำหรับการสร้าง token ขึ้นมาใหม่โดยใช้ \_tokenIds ที่เราสร้างไว้มาเป็น tokenId ตัวใหม่ โดย map กับ tokenURI ที่เราได้ทำการส่งมาด้วย

function burn token เป็นการลบ token ออกจาก mapping ที่ contract ได้ทำการเก็บไว้ ทำให้เราไม่สามารถเข้าถึง owner และ tokenURI ที่เราได้ทำการเก็บไว้ใน mapping ได้อีก

![NFT](./image/NFT2.png)

function fetchMyNFTs ทำหน้าที่ในการ filter token ที่เราได้เป็นเข้าของ และ ไม่ได้ทำการ burn ไปแล้วออกมาใรูปแบบของ array (เหตุผลที่เราจำเป็นต้องใช้ตัวแปล totalItemCount ในการ loop เพราะว่าในภาษา solidity นั้น array ไม่มี property length เพื่อหาขนาดของ array ที่เราต้องการจะสร้างและกำหนดค่าให้ array นั้น )

![mapping](./image/mapping.png)

## NFTMarket.sol

![marketplace1](./image/marketplace1.png)

NFTMarket เป็น contract ที่ใช้สำหรับเป็นตัวแทนสำหรับซื้อขาย NFT ที่เราได้ทำการ mint ขึ้นมา

ใน function constructor นั้นเราจะกำหนดให้ผู้ที่สร้าง transaction เป็นเจ้าของของ contract นี้ทำให้ address นั้นสามารถเรียกใช้ function ที่จำกัดให้เฉพาะ owner ได้

struck MarketItem จะเป็น type ที่เราสามารถกำหนดขึ้นเองได้ว่าภายในได้ว่าเราต้องการจะให้มีอะไรบ้างภายใน struct (คล้ายๆ Object)

event MarketItemCreated ให้เราลองนึกภาพคล้ายการเก็บข้อมูลแบบ log แบบปกติที่เราสามารถดักจับ event เมื่อเกิดขึ้นได้ และสามารถ query ขึ้นมาดูได้ส่วน key words indexed นั้นเราใส่เพื่อให้สามารถ query โดยใช้ค่าของตัวแปลนั้นในการ query ได้ โดยเราจะทำการ emit event นี้ทุกครั้งที่มีการ สร้าง market item ขึ้นมาใหม่

idToMarketItem เป็น maping ของ uint256 กับ MarketItem ที่ใช้ map id ของ item เข้ากับข้อมูลของ item นั้นๆ

function getListingPrice ทำหน้าที่ return ค่าธรรมเนียมที่ user ต้องจ่ายทุกครั้งที่ได้ทำการขายสินค้าบน market

![marketplace2](./image/marketplace2.png)

function createMarketItem ใช้สำหรับสร้าง market item ขึ้นมาใหม่โดนการโอนความเป็นเจ้าของของ nft นั้นๆไปที่ contract เพื่อให้ contract market สามารถ list บน market ได้โดย id ของ item นั้นมากจาก \_itemIds และจะถูกเพิ่มค่าขึ้นที่ละ 1 ก่อนการสร้าง item ขึ้นมาในทุกๆครั้ง

![marketplace3](./image/marketplace3.png)

function createMarketSale เป็น function ที่ใช้ซื้อ item ที่อยู่ใน market โดยการโอนเงินตามจำนวนมี่ตั้งให้กับผู้ตั้งขาย แล้วทำการโอนความเป็นเจ้าของของ NFT นั้นให้กับผู้ซื้อ หลังจากนั้นลบ item ที่อยู่บน market

![marketplace4](./image/marketplace5.png)

function fetchMyNFTs ทำหน้าที่ return item ที่เราเป็นเจ้าของกลับออกมาในรูปแบบ array เหตุผลที่เราใช้ key words memory เพราะว่าถ้าเราไม่ใช้ node ของ block เวลาที่เขียนกลับส่งมาหาเราจะเขียนบน storage ทำให้ใช้ค่า gas มากว่า การเขียนบน memory และการที่เรากำหนดความยาวของ array ให้กับตัวแปล items จะทำให้ค่า gas ถูกลงกว่าการที่เราไม่กำหนดความยากให้กับ array ในตอนแรก

![marketplace4](./image/marketplace6.png)

function fetchItemsCreated จะทำหน้าที่เหมือนกับ function fetchMyNFTs แต่จะเปลี่ยนเงื่อนไขเป็น item ที่เราเป็นคนสร้างแทน

![marketplace4](./image/marketplace7.png)

event DeleteMarketItem ใช้เก็บรายละอียดของการ delete item ที่อยู่บน market

function isMarketItem ใช้ตรวจสอบว่า NFT นั้นถูก list อยู่บน market หรือไม่

![marketplace4](./image/marketplace8.png)

function deleteMarketItem ใช้ลบ item ที่อยู่บน market ออกไป โดยผู้ที่จะลบนั้น จะต้องเป็นเจ้าของหรือว่า address ที่ถูก approve แล้วเท่านั้น

function getMarketIdByToken ใช้ query หา id ของ item id โดย id ของ NFT

บรรทัดที่ 84 createMarketSale เป็น function จะถูกใช้เมื่อมีการซื้อเกืดขึ้นบน marketplace

บรรทัดที่ 88 และ 89 เป็นการดึงค่าของราคา และ tokenId นั้นๆ ออกมาใช้งานผ่าน mapping ของ idTomarketItem

บรรทัดที่ 90 เป็นการเช็คว่า จำนวนเงินที่ส่งมานั้นมีค่าเท่ากับราคาของ NFT ที่ address นั้นจะทำการซื้อ

บรรทัดที่ 92 จะทำการโอนเงินจากที่ผู้ส่ง transaction ไปที่ address ของผู้ขาย

บรรทัดที่ 93 ทำการโอนความเป็นเจ้าของของ NFT นั้นไปให้ผู้ซื้อ

บรรทัดที่ 94 กำหนดค่าของ owner ใน mapping idToMarketItem ที่ id นั้น ให้เท่ากับ address ผู้ส่ง transaction นั้น ( ผู้ซื้อ ) และ sold ให้เป็น true

บรรทัดที่ 96 บวกค่าของตัวแปล itemsSold ไป 1

บรรทัดที่ 97 โอนเงินค่า listingPrice ไปที่เจ้าของ Contract ( address ที่ deployed Contract )

บรรทัดที่ 101 fetchMarketItems เป็น function สำหรับ เรียกรายการ NFT ทั้งหมดที่ยังไม่ได้ขายเเต่ list อยู่บน marketplace

บรรทัดที่ 102 เป็นการดึงจำนวน id ล่าสุดที่ถูกสร้างขึ้นจะได้จำนวนของ item ที่ถูกสร้างขึ้นมาทั้งหมดบน marketplace

บรรทัดที่ 103 เป็นการหาจำนวนของ NFT ที่ list อยุ่บน marketplace แต่ยังไม่ถูกซื้อ โดยการ นำจำนวนทั้งหมดของ item มาลบกับจำนวน item ที่ถูกทำการขายไปแล้ว

บรรทัดที่ 104 สร้างตัวแปลที่ใช้ในการ loop

บรรทัดที่ 106 สร้างตัวแปลชนิด memory ประเภท array ที่ชื่อว่า items ขึ้นมาโดยกำหนดให้มีความยาวของ array เท่ากับจำนวนของ item ที่อยู่บน marketplace ที่ยังไม่ได้ขาย

บรรทัดที่ 107 loop ไปที่ mapping ของ idToMarketItem ตามความยาวของตัวแปลที่ได้มากจาก itemCount เนื่องจาก mapping ไม่สามารถ loop ได้จึงได้เอาความยาวของ mapping มาใช้เเทนโดยเลือกจาก item ที่มีค่าของ owner เท่ากับ address(0) ( address(0) มีค่าเท่ากับ 0x00... ซื้อเราได้กำหนดค่าให้ตอนที่สร้างขึ้นมา ) หลังจากนั้นจึงนำค่าที่ได้ไปใส่ใน array ที่เราสร้างขึ้นจนครบจำนวน loop ที่เราต้องการจึง return ออกไป

![marketplace4](./image/marketplace4.png)

บรรทัดที่ 119 fetchMyNFTs เป็น function สำหรับ เรียกรายการ NFT ทั้งหมดที่ address ที่สร้าง transaction ขึ้นเป็นเจ้าของ

บรรทัดที่ 124 loop ตามจำนวนความยาวของ item ที่มีทั้งหมดเพื่อหาจำนวนของ item ที่มี address ที่สร้าง transaction ขึ้นเป็นเจ้าของ

บรรทัดที่ 130 สร้าง ตัวแปล items เป็น array และมีความยาวเท่ากับจำนวนจำนวน NFT ที่ address นั้นเป็นเจ้าของ

บรรทัดที่ 131 loop ตามจำนวนความยาวของ mapping idToMarketItem โดยเลือกจาก item ที่มีค่าของ owner เท่ากับ msg.sender ( address ที่เป็นผู้ส่ง transaction ) เเล้ว return กลับไป

![marketplace5](./image/marketplace5.png)

บรรทัดที่ 143 fetchItemsCreated เป็น function สำหรับ เรียกรายการ NFT ทั้งหมดที่ address ที่สร้าง transaction ขึ้นเป็นคนสร้างขึ้น

บรรทัดที่ 146 loop ตามจำนวนความยาวของ item ที่มีทั้งหมดเพื่อหาจำนวนของ item ที่มี address ที่สร้าง transaction ขึ้นเป็นคนสร้างขึ้นมา

บรรทัดที่ 154 สร้าง ตัวแปล items เป็น array และมีความยาวเท่ากับจำนวนจำนวน NFT ที่ address ที่สร้าง transaction ขึ้นเป็นคนสร้างขึ้นมา

บรรทัดที่ 156 loop ตามจำนวนความยาวของ mapping idToMarketItem โดยเลือกจาก item ที่มีค่าของ seller เท่ากับ msg.sender ( address ที่เป็นผู้ส่ง transaction ) เเล้ว return กลับไป
