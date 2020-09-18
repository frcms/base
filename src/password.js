var bcrypt = require('bcrypt');

exports.cryptPassword = async function(password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
};

exports.comparePassword = async function(plainPass, hashword) {
   bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
       return err == null ?
           isPasswordMatch :
           console.error(err); 
   });
};