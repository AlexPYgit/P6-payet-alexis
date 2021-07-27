
const Sauces = require('../models/Sauces');
const fs = require('fs');

// create a new sauce
exports.creatingSauce = ( req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const isNotEmpty = (textInput = "", regex = /([^\s])/) => regex.test(textInput);
    // verify if the input is empty
    if ( !isNotEmpty(sauceObject.name) ||
    !isNotEmpty(sauceObject.manufacturer)  ||
    !isNotEmpty(sauceObject.description)  ||
    !isNotEmpty(sauceObject.mainPepper) )
    {
        throw 'Input is empty !';
    }else{
        delete sauceObject._id;    
        const sauces = new Sauces({ 
           description : sauceObject.description,
           dislikes : 0,
           heat : sauceObject.heat,
           likes : 0,
           mainPepper : sauceObject.mainPepper,
           manufacturer : sauceObject.manufacturer,
           name : sauceObject.name,
           userId : sauceObject.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
    sauces.save()
    .then(() => res.status(201).json({ message: 'Objet crée ! ' }))
    .catch( error => res.status(400).json({error}));
    }
};

// user's note
exports.liked = (req, res, next) => {
    const userId = req.body.userId;
     Sauces.findOne({_id : req.params.id, usersLiked : req.body.userId}, {usersLiked: 1,_id:0, usersDisliked : 1})
            .then(sauces => {
              if(!sauces){
                  if(req.body.like === 1){
                        Sauces.updateOne({_id : req.params.id}, {$push:{usersLiked: userId }, $inc:{likes: +1}} )
                            .then( () => { res.status(200).json({ message : ' Objet modifié !'})})
                            .catch( error => res.status(400).json({ error }));      
                    } else if( req.body.like === -1){
                        Sauces.updateOne({_id : req.params.id}, {$push:{usersDisliked: userId }, $inc:{dislikes: +1}} )
                        .then( () => res.status(200).json({ message : ' Objet modifié !'}))
                        .catch( error => res.status(400).json({ error }));
                    } else if(req.body.like === 0){
                            Sauces.updateOne({_id : req.params.id}, {$pull:{usersDisliked: userId }, $inc:{dislikes: -1}})
                                .then( () => res.status(200).json({ message : ' Objet modifié !'}))
                                .catch( error => res.status(400).json({ error }));
                      }
                        }else {
                            if(req.body.like === 0){
                              console.log('voila 0')
                                  Sauces.updateOne({_id : req.params.id}, {$pull:{usersLiked: userId }, $inc:{likes: -1}})
                                      .then( () => res.status(200).json({ message : ' Objet modifié !'}))
                                      .catch( error => res.status(400).json({ error }));
                            }
                        }
                    res.status(200).json({msg: 'ok'})
            
            })
            .catch(error => res.status(400).json({error}));
};

// show all sauce
exports.getAllSauce=(req, res, next) => {
    Sauces.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error  => res.status(400).json({ error }));
}

// select one sauce
exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({_id : req.params.id})
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(404).json({ error}));
};


// modify one sauce
exports.modifySauce = (req, res, next) => {
    console.log(req.body);
    const validinput = req.body;
    const isNotEmpty = (textInput = "", regex = /([^\s])/) => regex.test(textInput);
    // verify if the input is empty
    if( !isNotEmpty(validinput.name) ||
    !isNotEmpty(validinput.manufacturer)  ||
    !isNotEmpty(validinput.description)  ||
    !isNotEmpty(validinput.mainPepper) )
    {
        throw 'Input is empty !';
    }
        const sauceObject = req.file ? 
        { ...JSON.parse(req.body.sauce),
            usersLiked : [],
            usersDisliked : [],
            likes : 0,
            dislikes : 0,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`}
        :
        {...req.body,
        usersLiked : [],
        usersDisliked : [],
        likes : 0,
        dislikes : 0,
        }
        Sauces.updateOne({ _id : req.params.id}, {...sauceObject,  _id : req.params.id})
        .then( () => res.status(200).json({ message : ' Objet modifié !'}))
        .catch( error => res.status(400).json({ error }));
    
};

// delete one sauce
exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({_id : req.params.id})
    .then( sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`,() => {
            Sauces.deleteOne({ _id : req.params.id})
            .then( () => res.status(200).json({message : ' Object suprimé !'}))
            .catch( error => res.status(400).json({ error}));
        })
    })
    .catch( error => res.status(500).json({error}));
};