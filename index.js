const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@youthmart-portal.bpyiy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const investmentsCollection = client.db("ymDb").collection("investments");
    // perform actions on the collection object

    app.get('/investments', (req, res) => {
        investmentsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                console.log('connected')
            })
    })

    app.post('/addInvestments', (req, res) => {
        const investments = req.body;
        console.log(investments)
        investmentsCollection.insertOne(investments)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
});

app.listen(process.env.PORT || port)