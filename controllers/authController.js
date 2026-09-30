import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {findByUsername,insertUser} from "../models/userModel.js";

function register(req,res){
    const{username,password}=req.body;
    if(!username || !password){
        res.status(400).json({error:"username and password are required"});
        return ;
    }
    findByUsername(username)
        .then((existingUser)=> {
        if(existingUser) {
            res.status(400).json({error:"username already exists"})
            return;
        }
        const hashedPassword=bcrypt.hashSync(password,10);
        return insertUser({username,password:hashedPassword});
    })
        .then((result) => {
            if(result){
                res.status(201).json({message:"user created successfully"});
            }
        })
        .catch((err) => {
            res.status(500).json({error:"error while registering user"})
        })
}
function login (req, res) {
    const {username,password}=req.body;
    if(!username || !password){
        res.status(400).json({error:"username and password are required"});
        return;
    }
    findByUsername(username).then((user) => {
        if(!user){
            res.status(400).json({error:"Invalid username or password "});
            return;
        }
        const passwordValid=bcrypt.compareSync(password,user.password);
        if(!passwordValid){
            res.status(401).json({error:"Invalid username or password "});
            return;
        }
        const token= jwt.sign(
            {id:user._id,username:user.username},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN}
        );
        res.json({token:token});
    })
        .catch((err)=> {
            res.status(500).json({error:"error while logging in"})
        });
}
export {register,login};