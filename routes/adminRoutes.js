const express = require("express");
const adminRoutes = express.Router();
const User = require("../models/userModel");
const { renderAdminLogin,
     adminCheck ,
     adminLogout,
     userDelete,
     updateUser,
     update,
     admincreate,
     searchUser,
     backtoList
    } = require("../controllers/adminController");


// GET admin login page
adminRoutes.get("/login", renderAdminLogin);



// POST admin login
adminRoutes.post("/home", adminCheck);

adminRoutes.get("/home", backtoList);

//admin logout
adminRoutes.post("/logout",adminLogout )



//Delete user 
adminRoutes.delete('/delete/:id', userDelete);


// update User

adminRoutes.get("/updateUser",updateUser)


adminRoutes.post("/update",update)
// adminRoutes.get("/update",update)


adminRoutes.post("/createuser",admincreate)


//serach admin

adminRoutes.post("/search",searchUser)
// Export the adminRoutes
module.exports = adminRoutes;
