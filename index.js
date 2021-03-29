const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASSWORD}@cluster0.cct2c.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (request, response)=>{
	response.send('working');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  
  app.post('/addProduct', (request, response)=>{
	 const products = request.body; 
	 productsCollection.insertOne(products)
	.then(result => {
		console.log(result.insertedCount);
	response.send(result.insertedCount)	
	})
  })

  app.get('/products', (request, response)=>{
 productsCollection.find({})	  
 .toArray((err, documents)=>{
	 response.send(documents);
 })
  })

  app.get('/product/:key', (request, response)=>{
	productsCollection.find({key: request.params.key})	  
	.toArray((err, documents)=>{
		response.send(documents[0]);
	})
	 })
app.post('/productsByKeys', (request, response)=>{
	const productKeys = request.body;
	productsCollection.find({key:{$in: productKeys }})
	.toArray((err, documents)=>{
	response.send(documents)	
	})
})

app.post('/addOrder', (request, response)=>{
	const order = request.body; 
	ordersCollection.insertOne(order)
         .then(result => {
         response.send(result.insertedCount > 0)	
         })
 })

});

app.listen(process.env.PORT || port)