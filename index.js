const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

const password = "YxwHmdP4@2uRb-5"

const uri = "mongodb+srv://project1:YxwHmdP4@2uRb-5@cluster0.7nh6l.mongodb.net/project1?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


client.connect(err => {
  // console.log(err)
  const collection = client.db("project1").collection("product");

  app.get('/products', (req, res) => {
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
      // do it tomorrow
    })
  })


  app.post('/addProduct', (req, res) => {
    const product = req.body
    collection.insertOne(product)
    .then(result => {
      console.log('data added succesfully')
      res.redirect('/')
    })
  })

  app.patch('/update/:id', (req, res) => {
    // console.log(req.body.price)
    collection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      console.log(result)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      console.log(result)
    })
  })

  // client.close();
});


app.listen(3000, () => console.log('calling'))