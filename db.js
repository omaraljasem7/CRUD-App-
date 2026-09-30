import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const uri= process.env.MONGO_URI;
let db;

const client = new MongoClient(uri);
/*
async function connectDB() {
   await client.connect();
   db=client.db('bookstore');

    console.log('MongoDB connected to bookstore')
}

 */
function connectDB(){
    return client.connect()
        .then(()=> {
            db=client.db('bookstore');
            console.log('MongoDB Connected! to DB:bookstore');
        })
        .catch( (error) => {
            console.log('MongoDB Connected Error:', error)
        })
}
function getDB(){
    return db;
}
export {connectDB,getDB};