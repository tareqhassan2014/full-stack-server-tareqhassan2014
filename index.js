const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const port = process.env.PORT || 5055

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x1vlg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection error", err);
    const bookCollection = client.db(`${process.env.DB_NAME}`).collection("books");
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");


    app.post('/admin/addBook', (req, res) => {
        const newBook = req.body;
        bookCollection.insertOne(newBook)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/books', (req, res) => {
        bookCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.get('/orders/:email', (req, res) => {
        const email = req.params.email
        orderCollection.find({ email: email })
            .toArray((err, items) => {
                res.send(items)
            })
    })



    app.delete('/deletBook/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        bookCollection.findOneAndDelete({ _id: id })
            .then((result, err) => {
                res.json(result)
            })
    })

    app.delete('/deletOrder/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        orderCollection.findOneAndDelete({ _id: id })
            .then((result, err) => {
                res.json(result)
            })
    })


    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })



    console.log("database connected.");
    // client.close();
});







app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})