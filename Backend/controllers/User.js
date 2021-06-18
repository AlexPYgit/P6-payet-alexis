
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then( hash => {
        const user = new User({
            email : req.body.email,
            password : bcrypt.hash
        })
        user.save()
        .then( () => res.status(201).json({message : "Utilisateur crée !" }))
        .catch( error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login= (req, res, next)=> {
    
    
};
