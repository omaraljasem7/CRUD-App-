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


// DELETE Request
app.delete('/books/:id',(req,res) => {
    const param = req.params.id;
    console.log(param);
    let id ;
    try {
        id = new ObjectId(param);
        console.log(id);
    }
    catch (error){
        res.status(500)
            .json({error:'Invalid ID '});
        return;
    }

    // connect to db
    const db = getDB();
    // connect to collection
    const collection = db.collection('books');
    collection.deleteOne({_id:id})
        .then((result) => {
            if (result.deletedCount === 0){
                res.status(404)
                    .json({error:'Book is not found'});

            }
            else {
                res.status(200).json({
                    message:'Book deleted successfully'
                });
            }
        })
        .catch( (error) => {
            res.status(500)
                .json({error:'Error while deleting the book'})
        })
});

// PUT Request


app.put('/books/:id',(req,res) => {
    const id =req.params.id;
    let objectId;
    try{
        objectId = new ObjectId(id);
    }
    catch (error){
        res.status(500)
            .json({error:'Invalid ID'});
        return;
    }

    console.log(id);
    console.log(objectId);
    const {title,author,pages,price}=req.body;

    // body should contain all properties title , author , pages, price
    // title and author should be from type string  && pages , price should from type numer
    // pages & price should not be < 0

    if (!title || ! author || !pages || !price ){
        res.status(400)
            .json({message:'title ,author , price and page are required '});
        return;
    }

    if (typeof title !== "string" || typeof author !== "string"){
        res.status(400)
            .json({message:'title , author should be from type string'});
        return;
    }

    if (typeof pages !=="number" || typeof price !== "number"){
        res.status(400)
            .json({message:'pages and price should be from type number'});
        return;
    }
    if (pages < 0 || price < 0 ){
        res.status(400)
            .json({message:'pages or price are < 0 '});
        return;
    }
    const updatedBook= {title,author,pages,price};

    const db = getDB();
    const collection =db.collection('books');
    collection.replaceOne({_id:objectId},updatedBook)
        .then((result) => {
            if(result.matchedCount===0){
                res.status(404)
                    .json({message:'Book not found'})
            }
            else {
                res.status(200)
                    .json(result);
            }
        })
        .catch((error)=>{
            res.status(500)
                .json({error:'Error while updating the book'})
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
