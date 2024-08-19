const User = require("../models/userModel");
const adminRoutes = require("./adminController")
const bcrypt = require('bcrypt') 

//hashPassword

const securePassword = (password)=>{
    try {
        const hashPassword = bcrypt.hash(password,10)
        return hashPassword;
    } catch (error) {
        console.log(error)
    }
}

// POST /user/register
const registerUser = async (req, res) => {
  const { name, email, password, username } = req.body;
  try {
      const userExist = await User.findOne({ email });

      const hpassword = await securePassword(password);
      console.log(hpassword);
      
      if (userExist) {
          return res.render("register", { message: "User already exists", messageType: "error" });
      }

      const user = await User.create({
          name,
          email,
          password : hpassword,
          username
      });

      if (user) {
          return res.redirect("/user/login"); // Redirect after successful registration
      } else {
          return res.render("register", { message: "Invalid operation", messageType: "error" });
      }
  } catch (error) {
      return res.status(500).render("register", { message: error.message, messageType: "error" });
  }
};


// POST /user/login
const homeloginUser = async (req, res) => {
  console.log("hooo");
  
  const { email, password } = req.body;
  console.log(password);
  
  if (!email || !password) {
      return res.status(400).render("login", { message: "Please enter email and password", messageType: "error" });
  }
  try {
      const userLoginExist = await User.findOne({ email });
      console.log(userLoginExist, 'exist user.......');
      
      if (userLoginExist) {
        console.log("hooo");
        console.log('Plain text password:', password);
console.log('Stored hashed password:', userLoginExist.password);

        const bpassword = await bcrypt.compare(password,userLoginExist.password)
        console.log(bpassword, 'bvgcffycvufdt')
          if (bpassword) {
              if (userLoginExist.isAdmin) {
                  return res.redirect("/user/login?message=Admin cannot login here");
              } else {
                  req.session.user = req.body.email;
                  return res.redirect("/user/home"); 
              }
          } else {
              return res.status(400).render("login", { message: "Invalid password", messageType: "error" });
          }
      } else {
          return res.status(400).render("login", { message: "User does not exist", messageType: "error" });
      }
  } catch (error) {
      return res.status(500).render("login", { message: "Internal server error", messageType: "error" });
  }
};

//user Logout

const userLogout = (req, res) => {

  req.session.destroy((error) => {
    if (error) {
      throw new Error
    } else {
      res.redirect("/user/login")
    }
  })

};


module.exports = { 
    registerUser,
     homeloginUser,
      userLogout,
      securePassword
     };
