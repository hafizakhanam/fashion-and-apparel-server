const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnxfzlt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db("productDB").collection("product");
    const categoryCollection = client.db("productDB").collection("category");

    app.get('/product', async(req, res) =>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/product', async(req, res) =>{
      const newProduct = req.body;
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    app.get('/category', async(req, res) =>{
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/category', async(req, res) =>{
      const newCategory = req.body;
      console.log(newCategory)
      const result = await categoryCollection.insertOne(newCategory);
      res.send(result);
    })


    app.get('/category/:id', async(req, res) =>{
      const id = req.params.id;
      const objectId = new ObjectId(id);
      const category = await categoryCollection.findOne({ _id: objectId });
      const query = {brandName: category.categoryName}
      const products = await productCollection.find(query);
      const result = await products.toArray();
      console.log(result)  
      res.send(result); 
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) =>{
    res.send('Server is running')
})

app.listen(port, () =>{
    console.log(`Server is running on port: ${port}`)
})