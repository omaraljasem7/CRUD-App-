import jwt from 'jsonwebtoken';

function verifyToken(req,res,next){
    const authHeader= req.headers["authorization"];
    if(!authHeader){
        res.status(401).json({error:'No token provided'});
        return;
    }
    //console.log(authHeader);
    //console.log(authHeader.split(" "))
    //console.log(authHeader.split(" ")[1]);
    const token = authHeader.split(" ")[1];
    if(!token){
        res.status(401).json({error:'Token format invalid'});
        return;
    }
    jwt.verify(token,process.env.JWT_SECRET, (err,decoded) => {
        if(err){
            res.status(401).json({error:"Token invalid or expired"})
            return;
        }
        req.user=decoded;
        next();
    })
}
export {verifyToken}