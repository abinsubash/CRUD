const User = require("../models/userModel");
const  bcrypt = require('bcrypt');

//hashPassword 

const securePassword = (password) =>{
    try {
        const hashPassword = bcrypt.hash(password,10);
        return hashPassword 
    } catch (error) {
        console.log(error);
        
    }
}

const renderAdminLogin = async (req, res) => {
    if (req.session.admin) {
        const userData = await User.find({ isAdmin: false });

        return res.render("adminHome", { users: userData });
    } else {
        return res.render("adminLogin");
    }
};

// Admin Login Check
const adminCheck = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).render("adminLogin", { message: "Please enter email and password", messageType: "error" });
        }
        
        // Find the admin user
        const adminUser = await User.findOne({ email, isAdmin: true });

        // Validate the admin user and password
        if (adminUser && adminUser.password === password) {
            req.session.admin = email;
            return res.redirect("/admin/home");
        } else {
            return res.status(401).render("adminLogin", { message: "Invalid email or password", messageType: "error" });
        }
    } catch (error) {
        return res.status(500).render("adminLogin", { message: "Internal server error", messageType: "error" });
    }
};

// Admin Logout
const adminLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render("adminHome", { message: "Error logging out", messageType: "error" });
        }
        res.redirect("/admin/login");
    });
};

// Delete a User
const userDelete = async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        return res.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ success: false, error: 'Error deleting user' });
    }
};

// Render Edit User Page
const updateUser = async (req, res) => {
    try {
        const userId = req.query.id;
        const userData = await User.findOne({ _id: userId });

        if (!userData) {
            return res.status(404).send('User not found');
        }

        return res.render('userEdit', { user: userData });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

// Update User Information
const update = async (req, res) => {
    try {
        const { id, name, email, username } = req.body;

        if (!name || !email || !username) {
            return res.render('userEdit', { message: 'Inputs cannot be empty', messageType: 'error' });
        }

        await User.updateOne({ _id: id }, { $set: { name, email, username } });

        return res.redirect("/admin/home");
    } catch (error) {
        console.error(error);
        return res.status(500).render("userEdit", { message: "Internal Server Error", messageType: "error" });
    }
};

// Create a New User
const admincreate = async (req, res) => {
    try {
       
        const { name, email, password, username } = req.body;
        console.log(req.body);
        
        const userExist = await User.findOne({ email });


        if (userExist) {
            
            return res.render("adminHome", { message: "User already exists", messageType: "error" });
        }

        const user = new User({ name :req.body.name,
             email : req.body.email,
              password: await securePassword(password),
               username:req.body.username,
             });
             await user.save()
        
        return res.redirect("/admin/home");
    } catch (error) {
        return res.status(500).render("adminHome", { message: "Internal Server Error", messageType: "error" });
    }
};

// Search for a User
const searchUser = async (req, res) => {
    try {
        if (req.session.admin) {
            const username = req.body.search;
            const findUser = await User.find({ name: { $regex: new RegExp(username, 'i') }, isAdmin: false });
            return res.render("adminHome", { users: findUser });
        } else {
            return res.redirect("/admin/login");
        }
    } catch (error) {
        return res.status(500).render("adminHome", { message: "Internal Server Error", messageType: "error" });
    }
};

// Redirect Back to Admin Home List
const backtoList = async (req, res) => {
    try {
        if (req.session.admin) {
            const userData = await User.find({ isAdmin: false });
            return res.render("adminHome", { users: userData });
        } else {
            
            return res.redirect("/admin/login");
        }
    } catch (error) {
        return res.status(500).render("adminHome", { message: "Internal Server Error", messageType: "error" });
    }
};

module.exports = { renderAdminLogin, adminCheck, adminLogout, userDelete, updateUser, update, admincreate, searchUser, backtoList };
