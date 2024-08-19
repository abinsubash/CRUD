const User = require("../models/userModel");


const checkSession = async (req, res, next) => {
  if (req.session.user) {
    const  userfind  = req.session.user;
    const existuser = await User.findOne({ email: userfind });
    if(!existuser){
        req.session.destroy((err) => {
            if(err){
                console.log('error');
            }
            return res.redirect('/user/login')
        })
    }
    else{
        next();
    }
  } else {
   next()
  }
};




module.exports = {

  checkSession
};
