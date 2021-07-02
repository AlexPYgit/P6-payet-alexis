
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
        .catch( error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login= (req, res, next)=> {
    User.findOne({ email : req.body.email})
    .then( user => {
        if(!user){
            return res.status(401).json( { error : 'Utilisateur non trouvé !'})
        } //Si l'email de l'utilisatuer n'est pas trouvé dans la base de données
        bcrypt.compare( req.body.password , user.password) //utilise la fonction async compare de bcrypt pour comparer les 2 hash des mdp saisi
            .then( valid => {
                if(!valid){
                    return res.status(401).json( { error : 'Mot de passe incorrect !'})
                };
                res.status(200).json({
                    userId : user._id,
                    // On install le Package jsonwebtoken pour crée et gérer les token des utilisateurs avec la commande npm install --save jsonwebtoken
                    token: jwt.sign( //on utilise une fonction du jwt, et on passe en params les donnée que l'on souhaite encoder
                        {userId : user._id}, //vérifie que la req corespond au userId de la req
                        SECRET_TOKEN,//clé secrette pour l'encodage
                        { expiresIn: '24h'} //argument de configuration, qui correspond à une expération du token après 24h
                        )
                });
            })
            .catch(error => res.status(500).json({error}));
    })
    .catch( error => res.status(500).json({error}));
};
