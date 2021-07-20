const jwt = require('jsonwebtoken');
require('dotenv').config({path: '.env'});
const SECRET_TOKEN = process.env.SECRET_TOKEN;

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify( token, SECRET_TOKEN); 
        const userId = decodedToken.userId; 
        if(req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        }else{ 
            next();
        }
    } 
    catch{
        res.status(401).json({error : new Error ('Requète non authentifiée !') });
    }
};
