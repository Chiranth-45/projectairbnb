const express=require("express");
const app=express();
const path=require("path");
const methodOverride = require('method-override');//mongodb itself creates it somewhere it is no use
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');// for embedding the code  in html 
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");


const Listing=require("./models/listing.js");
const Review=require("./models/review.js");//for reviewing the review model we can remove last 4 paths if we want because it is already added
const {listingSchema,reviewSchema}=require("./Schema.js");

const WrapAsync=require("./utils/WrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");


app.use(express.json());//to parse the json using middlewares
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));
app.engine('ejs', ejsMate); // Set ejs-mate as the template engine




const sessionOption={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
    },
};

app.use(session(sessionOption));//session middleware implemented here
app.use(flash());//use after app.use session only be careful

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


//define just before the routes requirement
app.use((req,res,next)=>
 {
      res.locals.success=req.flash("success");
      res.locals.error=req.flash("error");
      next();//very important to call it otherwise you stuck there itself
    
});

// app.get("/demouser",async(req,res)=>
// {
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"student",
//     });
//     let registeredUser=await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);

// });
    

const listingrouter=require("./routes/listing.js");//imported the listing routes
app.use("/listings",listingrouter);//setted the basic path as a listing here

const reviewsrouter=require("./routes/review.js");
app.use("/listings/:id/reviews",reviewsrouter);//setted the basic path as a review

const userrouter=require("./routes/user.js");
app.use("/",userrouter);

//adding this two files are also important beacuse we stuck in the error of not getting the request

//applicable for all the errors which are present
app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"Page Not Found!"));  

});                                                                       

//custom error handling error
app.use((err,req,res,next)=>
{
        let {statusCode=500 ,message="Something Went Wrong"}=err;
        res.status(statusCode).render("./listings/error.ejs",{err});
        //res.status(statusCode).send(message);
        
});
    

app.listen(8080,()=>
{
    console.log(`Succesfully listening to the 8080`);
});
    

  