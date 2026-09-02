import express from 'express';
import {ObjectId} from "mongodb";

import {connectDB,getDB} from './db.js'
let app = express();



const PORT = 3000;
// for post requests
app.use(express.json());

app.get("/",(req,res)=> {
    console.log(req.route.path);
    res.send("Hello World!");
})
app.get('/about',(req,res)=>{
    res.send('About Page');
})
/*
app.get('/books',(req,res) => {
    const db = getDB();
    const collection =db.collection('books');
    collection.find().toArray()
        .then(books=> {res.json(books)})
        .catch(err => res.json({error:'Error while fetching books'}))
})

*/
app.get("/books", (req, res) => {
    const db = getDB();
    const collection = db.collection("books");
    collection.find().toArray().then((books) => {
        res.json(books);
    }).catch((error) => {
        res.status(500).json({ error: "Error while getting the books" });
    });
});



app.use((req,res)=>{
    res.status(404).send('Not Found Page');
})

connectDB().then ( () => {
    app.listen(PORT, () => {
        console.log('server started on port ' , PORT)
    })
});
