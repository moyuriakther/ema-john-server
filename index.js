const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u5uel.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('welcome')
})
const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
    
  app.post('/addProducts', (req, res)=>{
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount);
           res.send(result.insertedCount);
        })
    })

    app.get('/products', (req, res) =>{
        productsCollection.find({})
        .toArray( (err, documents) =>{
            res.send(documents)
        })
    })

    app.get('/product/:key', (req, res) =>{
        productsCollection.find({key: req.params.key})
        .toArray( (err, documents) =>{
            res.send(documents)
        })
    })

    app.post('/productByKeys', (req, res) =>{
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray( (err , document) => {
            res.send(document)
        })
    }) 
});


app.listen(process.env.PORT || port)