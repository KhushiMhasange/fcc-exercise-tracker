const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect("mongodb+srv://KhushiMhasange:<password>@cluster0.d2sb7l4.mongodb.net/tracker?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>console.log("Database Connected !!!"))
.catch(err=>console.error("Error Connecting to DB :(",err));

//creating schema for users

const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true
    }
});
const User = mongoose.model('User',userSchema);

const exerciseSchema = new mongoose.Schema({
    userid: String,
    username: String,
    description:String,
    duration :Number,
    date:{
        type : Date,
        default: Date.now
    }
});
const Exercise = mongoose.model('Exercise',exerciseSchema);
module.exports = {User,Exercise};
