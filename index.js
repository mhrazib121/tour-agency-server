const { MongoClient } = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectId;
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
        const bookingCollection = database.collection("bookings");

        // post services api
        app.post('/services', async (req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package);
            res.json(result);
        })

        // get api 
        app.get('/services', async(req, res)=>{
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages)
        })
        // single api 
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('getin single', id)
            const query = {_id: ObjectId(id)};
            const package = await packageCollection.findOne(query);
            res.json(package);
        })
        // Package Booking Post
        app.post('/bookings', async(req, res) => {
            const packageBooking = req.body;
            const result = await bookingCollection.insertOne(packageBooking);
            res.json(result);
        })

        // Package Booking get 
        app.get('/bookings', async(req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })
        

        // booking delete 

        app.delete('/bookings/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            res.json(result)
            console.log(result);

        })

        // Update Booking Status 
        app.put('/bookings/:id', async(req, res)=> {
            const id = req.params.id;
            const updateBookingStatus = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set:{
                    status: updateBookingStatus.status
                }
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
    }
    finally {

    }
    // hello he 
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running Tourism Webside')
});

app.listen(port, (req, res) => {
    console.log('Running server', port)
})