const express = require ('express');
const BodyParser = require('body-parser');
const mongoose = require('mongoose');

const UserRouter = require('./router/User');

const app = express();

mongoose.set('useCreateIndex', true);
//  permet de ce connecter à la base de données avec ces informations et son MDP
mongoose.connect('mongodb+srv://Jhon_doe:JhonDoe@cluster0.2aep0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
 { useNewUrlParser: true,
   useUnifiedTopology: true })
 .then(() => console.log('Connexion à MongoDB réussie !'))
 .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*');// permet l'acces à tous
 res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //détail le type de header accépté
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//détaille les action possible sur l'api
 next();
});

app.use(BodyParser.json());

app.use('/api/auth', UserRouter);

module.exports = app;