const { MongoClient } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvulc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected');
        const database = client.db("tourPackage");
        const packageCollection = database.collection("packages");

        // get api 
        app.get('/services', async(req, res)=>{
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages)
        })

        // post api
        app.post('/services', async (req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package);
            res.json(result);

        })
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running Tourism Webside')
});

app.listen(port, (req, res) => {
    console.log('Running server', port)
})