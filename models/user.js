const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type:String,
        required:true
    }
});
//username and password (salted and hashed) are automatically created and stored by passport-local-mongoose so no need to make fields
//for them in schema
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User", userSchema);

//pbkdf2 hashing algorithm is implemented here