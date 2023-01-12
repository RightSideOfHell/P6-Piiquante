const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();
// Constitue le MDP: entre 5 et 10 caractères avec une maj, une min, un chiffre et sans espace
passwordSchema
.is().min(5)                                    
.is().max(100)                                  
.has().uppercase()                              
.has().lowercase()                             
.has().digits()                                
.has().not().spaces()

module.exports = passwordSchema;