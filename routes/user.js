const express=require("express");
const router=express.Router();
const user=require("../models/user.js");
const WrapAsync=require("../utils/WrapAsync.js");
const passport = require("passport");

router.get("/signup",(req,res)=>
{
    res.render("./users/signup.ejs");
   

});


router.post("/signup",WrapAsync(async(req,res)=>
{
   try{
    let {username,email,password}=req.body;
    const newuser=new user({username,email});
    const registereduser=await user.register(newuser,password);//saving method in passport local host authentication
    console.log(registereduser);
    req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listings");
   }
   catch(e)
   {
    req.flash("error","username already exists");
    res.redirect("/signup");
   }
}));

router.get("/login",(req,res)=>
{
        res.render("./users/login.ejs");
      
    
});

//login page using passport
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
async(req,res)=>
{
    req.flash("Welcome to Wanderlust! You are logged in");
    res.redirect("/listings");
         
});

module.exports=router;