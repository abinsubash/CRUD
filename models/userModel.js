const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username:{
        type:String,
        require:true
    },
    isAdmin:{
        type: Boolean,
        default:false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
