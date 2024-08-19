const express = require("express");
const { registerUser, homeloginUser, userLogout } = require("../controllers/userController");
const { checkSession }= require("../middleware/usermiddleware")
const userRoutes = express.Router();
userRoutes.use(checkSession)

userRoutes.get("/register", (req, res) => {
    const message = req.query.message; 
    res.render("register", { message });
});

userRoutes.post("/register", registerUser);

userRoutes.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/user/home"); 
    } else {
        res.render("login");
    }
});

userRoutes.get("/home",(req, res) => {
    if (req.session.user) {
        res.render("userhome"); 
    } else {
        res.redirect("/user/login"); 
    }
});


userRoutes.post("/logout", userLogout);

userRoutes.post("/home", homeloginUser);

module.exports = userRoutes;
