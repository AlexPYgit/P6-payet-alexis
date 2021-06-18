const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];//on vérifi le token de l'utilisateur en le récupérant dans authorization du navigateur et split [1] pour avoir que le token
        const decodedToken = jwt.verify( token, 'RANDOM_TOKEN_SECRET'); //décode le token et retourne un objet JS
        const userId = decodedToken.userId; // On récupère le userId que l'on a encodé dans le token
        if(req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        }else{ 
            next();
        }
    } catch{
        res.status(401).json({error : new Error ('Requète non authentifiée !') });
    }
};