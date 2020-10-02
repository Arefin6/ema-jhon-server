var express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8pkoh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("ema-jhon-simple").collection("products");
  const ordersCollection = client.db("ema-jhon-simple").collection("orders");
    
   app.post('/addProduct',(req,res) => {
       const products = req.body;
       productsCollection.insertMany(products)
       .then(result =>{
           console.log(result);
           res.send(result.insertedCount);
       })
   })

   app.get('/products',(req,res) =>{
       productsCollection.find({})
       .toArray((err,documents) =>{
           res.send(documents);
       })
   })

   app.get('/product/:key',(req,res) =>{
    productsCollection.find({key:req.params.key})
    .toArray((err,documents) =>{
        res.send(documents[0]);
    })
   })

    app.post('/productsByKeys',(req,res) =>{
         const productKeys = req.body;
         productsCollection.find({key:{ $in: productKeys }})
         .toArray((err,documents)=>{
             res.send(documents);
         })
    });

    app.post('/addOrder',(req,res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders)
        .then(result =>{
            res.send(result.insertedCount > 0);
        })
    })


});


app.listen(5000)