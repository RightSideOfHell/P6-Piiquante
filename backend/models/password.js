const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(5)                                    
.is().max(100)                                  
.has().uppercase()                              
.has().lowercase()                             
.has().digits()                                
.has().not().spaces()                           // Should not have spaces

module.exports = passwordSchema;