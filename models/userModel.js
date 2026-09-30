import {getDB} from "../db.js";
function getCollection(){
    const db = getDB();
    return  db.collection("users");
}

function findByUsername(username){
    return getCollection().findOne({username})
}

function insertUser(userData){
    return getCollection().insertOne(userData);
}
export {findByUsername,insertUser};