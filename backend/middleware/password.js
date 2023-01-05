const passwordSchema = require("../models/password");

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ error: "Le mot de passe doit faire au moins 5 caractères dont une maj et un chiffre "+ passwordSchema.validate(req.body.password, { list: true })} );
    } else {
        next();
    }
};