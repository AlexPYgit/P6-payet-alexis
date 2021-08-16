
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config({path: '.env'});
const SECRET_TOKEN = process.env.SECRET_TOKEN;

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then( hash => {
        const user = new User({
            email : req.body.email,
            password : hash
        })
        user.save()
        .then( () => res.status(201).json({message : "Utilisateur crée !" }))
        .catch( error => res.status(400).json( {error  : "Erreur d'enregistrement du compte"} ));
    })
    .catch(error => res.status(500).json({error : 'Erreur de création du compte'}));
};

exports.login= (req, res, next)=> {
    User.findOne({ email : req.body.email})
    .then( user => {
        if(!user){
            return res.status(401).json( { error : 'Utilisateur non trouvé !'})
        }
        bcrypt.compare( req.body.password , user.password) 
            .then( valid => {
                if(!valid){
                    return res.status(401).json( { error : 'Mot de passe incorrect !'})
                };
                res.status(200).json({
                    userId : user._id,
                    token: jwt.sign( 
                        {userId : user._id}, 
                        SECRET_TOKEN,
                        { expiresIn: '24h'} 
                        )
                });
            })
            .catch(error => res.status(500).json({error : 'Erreur vérification mot de pass'}));
    })
    .catch( error => res.status(500).json({error: "Erreur survenu pendant la connexion au compte"}));
};
