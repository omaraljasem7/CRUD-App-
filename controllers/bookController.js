import {ObjectId} from "mongodb";
import {getDB} from '../db.js'

function getAllBooks(req,res){
    const db = getDB();
    const collection = db.collection("books");
    collection.find().toArray().then((books) => {
        res.json(books);
    }).catch((error) => {
        res.status(500).json({ error: "Error while getting the books" });
    });
}

function getBookById( req,res){
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
                res.json(book);
            }
        })
        .catch((error)=>{
            res.status(500).json({error:'Error while fetching the book with id '})
        })
}
function createBook(req,res){
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
}
function createBookValid(req,res){
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
}
function deleteBook(req,res){
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
}
//updateBook for Patch and replaceBook for Put

function updateBook(req,res){
    const id = req.params.id;
    let objectId;
    try {
        objectId = new ObjectId(id);
    }
    catch (error){
        res.status(500)
            .json({message:'invalid ID'});
        return;
    }
    const updates =req.body;

    // check the length of the json sent from the client , if empty , then error response
    console.log("keys " + Object.keys(updates).length);
    if(Object.keys(updates).length === 0 ){
        res.status(400)
            .json({error:'Json is empty , min 1 field should be sent '});
        return;
    }

    const allowedFields = ['title','author','pages','price'];
    const invalidFields =Object.keys(updates).filter(key => !allowedFields.includes(key));
    if(invalidFields.length > 0 ){
        res.status(400)
            .json({error:`Invalid Fields ${invalidFields.join(", ")}`})
        return;
    }

    //
    if (updates.title !== undefined && typeof updates.title !== "string"){
        res.status(400)
            .json({error:'Title must be a string'});
        return;
    }
    if (updates.author !== undefined && typeof updates.author !== "string"){
        res.status(400)
            .json({error:'author must be a string'});
        return;
    }
    if (updates.price !== undefined &&( typeof updates.price !=="number" || updates.price < 0) ){
        res.status(400).json({error:'pages must be a number or  > 0 '});
        return;
    }
    if (updates.pages !== undefined &&( typeof updates.pages !=="number" || updates.pages < 0) ){
        res.status(400).json({error:'pages must be a number or >0 '});
        return;
    }

    const db = getDB();
    const collection =db.collection('books');
    collection.updateOne({_id:objectId},{$set:updates})
        .then((result)=> {
            res.json({
                message:"partially updated successfully",
                result:result.modifiedCount
            });
        })
        .catch(error=> {
            res.status(500)
                .json({error:'Error while updating the book'})
        })
}
function replaceBook(req,res){
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
}
function paginateBook(req,res){
    const page=parseInt(req.query.page)|| 1;
    const limit = parseInt(req.query.limit) || 2 ;
    /*
     console.log(page);
     console.log(limit);
     console.log(typeof page);
     console.log(typeof limit);
     */
    const skip = (page -1 ) * limit;

    const db =getDB();
    const collection = db.collection("books");

    collection.find().skip(skip).limit(limit).toArray()
        .then((result) => {
            res.json({
                page:page,
                limit:limit,
                books:result
            })
        })
        .catch(error=> {
            res.status(500)
                .json({error:'Error while updating the book'});
        })
}

export {getBookById,getAllBooks,createBook,createBookValid,deleteBook,updateBook,replaceBook,paginateBook}