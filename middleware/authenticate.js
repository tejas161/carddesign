const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');





const Authenticate = async (req,res,next) => {
   
    try{
   const token = req.cookies.jwtoken;
  
   const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
   console.log(token);
   const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});

   if(!rootUser){
       throw new Error('User not Found');
   }

   req.token = token;
   req.rootUser = rootUser;
   req.userID = rootUser._id;
  
   next();

    }
    catch(err){
        console.log('aythenicate page backend');
        res.status(401).send('unauthorized : no token provided');
        console.log(err);
    }

}

module.exports = Authenticate;