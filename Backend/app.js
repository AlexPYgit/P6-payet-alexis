const express = require ('express');
const BodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require ('helmet');


const UserRouter = require('./router/User');
const SauceRouter = require('./router/Sauces');
require('dotenv').config();

const app = express();
app.use(helmet());

const MDP_db = process.env.MDP_DB;
const User_db = process.env.User_DB;

mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb+srv://${User_db}:${MDP_db}@cluster0.2aep0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
 { useNewUrlParser: true,
   useUnifiedTopology: true })
 .then(() => console.log('Connexion à MongoDB réussie !'))
 .catch(() => console.log('Connexion à MongoDB échouée !'));

app.disable('x-powered-by');

app.use((req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); 
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
 next();
});

app.use(BodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', UserRouter);
app.use('/api/sauces',SauceRouter);

module.exports = app;