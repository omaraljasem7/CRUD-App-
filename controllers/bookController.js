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
    //validation is now done using JOI middleware
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
    // Validation is now done using JOI middleware
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
    //validation is now done using JOI middleware
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