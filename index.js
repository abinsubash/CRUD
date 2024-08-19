const mongoose = require("mongoose");
const express = require("express");
const path = require("path")
const session = require("express-session");
const nocache = require("nocache")
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes")
const app = express();
const sessionCheck = require("./controllers/userController");


// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static',express.static(path.join(__dirname,"public")));
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(nocache());


// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/company")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// View engine setup
app.set("view engine", "ejs");
app.set("views", "./views");


app.get("/",(req, res) => {
    if (req.session.user){
        res.redirect("/user/home")
    }else{
        res.redirect("/user/login"); // Redirect to the login page
    }
   
  });
  
  // Use the user routes
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// Start the server
app.listen(5000, () => console.log("Server started on port http://localhost:5000/user/login"));
