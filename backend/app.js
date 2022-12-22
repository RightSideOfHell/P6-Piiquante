const express = require('express');
const mongoose = require('mongoose');

const Sauce = require('./models/sauce');

//const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://Lysii:Moong0DBatla4s@piiquante.xruwvou.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/sauces', (req, res, next) => {
  const sauce = new Sauce({
    ...req.body
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

app.use('/api/sauces', (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
});

//app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use('api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;