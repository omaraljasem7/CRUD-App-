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

app.get('/books/:id',(req,res)=> {
    let id = req.params.id;
    console.log("id= " , id);
    let objectId;
    try {
        objectId = new ObjectId(id);
    }
    catch (error){
        res.status(300).json({error:'ID is not valid'})
        return;
    }
    console.log("objectId= ",objectId);

    const db = getDB();
    const collection =db.collection('books');
    collection.findOne({_id:objectId})
        .then((book)=> {
            if(book == null ){
                res.status(404)
                    .json({error:`Book with this id: ${id} does not exist in collection books`})
            }
            else{
                res.json({book:book});
            }
        })
        .catch((error)=>{
            res.status(500).json({error:'Error while fetching the book with id '})
        })

})

app.post('/books',(req,res)=> {
    const book = req.body;
    console.log(book);
    const db = getDB();
    const collection =db.collection('books');
    collection.insertOne(book)
        .then((result)=> {
            res.status(201).json({result:result});
        })
        .catch((error)=> {
            res.status(500).json({error:'Error while inserting book'})
        })
});

app.post('/booksvalid', (req,res)=> {
    const {title,author,pages,price}=req.body;
    // first check if properties are there in the json object from the client sent by postman
    // if sent then for example title will have a value otherwise it will be undefined

    if (!title || !author || !pages || !price ){
        res.status(400).json({error:"title, author pages ,price are required"})
        return;
    }

    // check if title and author are from type string

    if(typeof title !== "string" || typeof author !== "string"){
        res.status(400)
            .json({error:"title,author should be from type string"})
        return;
    }
    // check if pages and price are from typ number

    if(typeof pages !== "number" || typeof price !== "number"){
        res.status(400)
            .json({error:"pages and price should be from type number"})
        return;
    }
    // pages and price should not be < 0
    if (pages < 0 || price < 0 ){
        res.status(400)
            .json({error:"pages and price should be > 0 "})
        return;
    }

    const newBook= {title,author,pages,price};

    const db= getDB();
    const collection=db.collection('books');
    collection.insertOne(newBook)
        .then((result)=>{
            res.status(201)
                .json({result:result});
        })
        .catch((error)=>{
            res.status(500)
                .json({error:`Error while inserting book in route ${req.route.path}`})
        })

})

app.use((req,res)=>{
    res.status(404).send('Not Found Page');
})

connectDB().then ( () => {
    app.listen(PORT, () => {
        console.log('server started on port ' , PORT)
    })
});
