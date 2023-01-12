const Sauce = require('../models/sauce');
const fs = require('fs');

//Créer une sauce avec l'Id de l'utilisateur
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
    .catch(error => { res.status(400).json( { error })})
};

//Modifie une sauce si l'userId = userId du créateur de la sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non autorisé'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Supprime la sauce & l'image si l'userId = userId du créateur de la sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Non autorisé'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

// Permet de récupérer la sauce avec son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => {
            console.error(error);
            res.status(404).json({ message: error.message });
        });
};

// Permet d'afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => {
            console.error(error);
            res.status(404).json({ message: error.message });
        });
};

// like/dislike => ajoute et enlève l'ID de l'utilisateur dans l'array userLike/userDislike en fonction du clic like/dislike
exports.rateSauce = (req, res, next) => {
    let userId = req.body.userId

    if (req.body.like == 1){
        Sauce.updateOne(
            { _id: req.params.id },
            {$inc: {likes: 1},
            $push: {usersLiked: userId}
            }
        )
        .then(() => res.status(200).json({message: "J'aime"}))
        .catch(error => {
            console.error(error);
            res.status(404).json({ message: error.message });
        });
    } else if (req.body.like == -1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {$inc: {dislikes: +1},
            $push: {usersDisliked: userId}
            }

        )
        .then(() => res.status(200).json({message: "Je n'aime pas"}))
        .catch(error => {
            console.error(error);
            res.status(404).json({ message: error.message });
        });
    } else if (req.body.like == 0){
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            let usersLiked = sauce.usersLiked;
            let usersDisliked = sauce.usersDisliked;

            if(usersLiked.includes(userId)){
                Sauce.updateOne(
                    { _id: req.params.id },
                    {$inc: {likes: -1},
                    $pull: {usersLiked: userId}
                    })
                .then(() => res.status(200).json({message: "Je n'aime plus"}))
                .catch(error => {
                    console.error(error);
                    res.status(404).json({ message: error.message });
                });
            }else if (usersDisliked.includes(userId)){
                Sauce.updateOne(
                    { _id: req.params.id },
                    {$inc: {dislikes: -1},
                    $pull: {usersDisliked: userId}
                }
                )
                .then(() => res.status(200).json())
                .catch(error => {
                    console.error(error);
                    res.status(404).json({ message: error.message });
                });
            }
        })
        .catch(error => { res.status(400).json( { error })})
    }
}