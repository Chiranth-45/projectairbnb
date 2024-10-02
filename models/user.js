const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");//this is required for the mongoose connection bascially to work

const userSchema=new Schema({
    //by default username and password and other methods are added throgh the passportLocalMongoose plugins

    email:{
        type:String,
        required:true
    },
});

//using plugin to access the methods and some of the built in methods to work

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);