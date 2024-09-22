const express=require("express");
const app=express();
const path=require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');//mongodb itself creates it somewhere it is no use
const ejsMate = require('ejs-mate');// for embedding the code  in html 
const Listing=require("./models/listing.js");
const WrapAsync=require("./utils/WrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./Schema.js");
const Review=require("./models/review.js");//for reviewing the review model

app.use(express.json());//to parse the json using middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate); // Set ejs-mate as the template engine

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//to handle the server side validation throgh JOi object for listing model
const ValidateListing=(req,res,next)=>
{
    let {error}=listingSchema.validate(req.body);
    //console.log(result);//to know the deatils of it
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}  

//server side Error Handling for review model
const Validatereview=(req,res,next)=>
    {
        let {error}=reviewSchema.validate(req.body);
        //console.log(result);//to know the deatils of it
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,error);
        }
        else{
            next();
        }
    }  


//index route
app.get("/listings", WrapAsync(async (req, res) =>{
    const alllistings = await Listing.find({});//we can do .then also
    res.render("./listings/index.ejs",{alllistings});

}));

//new listinings  route
app.get("/listings/new",(req,res)=>
{
    res.render("./listings/new.ejs");

});

//adding new listings
app.post("/listings",ValidateListing, WrapAsync(async(req,res,next)=>
{
        
        // let result=listingSchema.validate(req.body);
        // //console.log(result);//to know the deatils of it
        // if(result.error)
        // {
        //     throw new ExpressError(400,result.error);
        // }
        let newlistings=new Listing(req.body.listing);
        await newlistings.save();
        res.redirect("/listings");
       
}));
    
//show route
app.get("/listings/:id",WrapAsync(async (req,res)=>
{
    let {id}=req.params; 
    let listing= await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
    
}));


app.get("/listings/:id/edit",WrapAsync(async (req,res)=>
{
        let {id}=req.params;
        let listing= await Listing.findById(id);
        res.render("./listings/edit.ejs",{listing});
       
}));

app.put("/listings/:id",ValidateListing,WrapAsync(async (req,res)=>
{
    if(!req.body.listing)
        {
            throw new ExpressError(400,"Send a valid data for listing");
        }    
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});//spreading data
    //res.redirect("/listings");
    res.redirect(`/listings/${id}`);//we redirect to any of the pages of the both 
    
}));



//delete route
app.delete("/listings/:id", WrapAsync(async (req, res) => {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

}));

//REviews Post Reviw Route is here
app.post("/listings/:id/review",Validatereview,WrapAsync(async(req,res,next)=>
{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    //res.send("new review saved");

    res.redirect(`/listings/${listing._id}`);


}));

//Delete Review Route
app.delete("/listings/:id/review/:reviewId",WrapAsync(async(req,res)=>
{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//this helps to delete and update the listing
    await Review.findOneAndDelete(reviewId);

    res.redirect(`/listings/${id}`);

})
);

//applicable for all the errors which are present
app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"Page Not Found!"));  

})

//custom error handling error
app.use((err,req,res,next)=>
{
    let {statusCode=500 ,message="Something Went Wrong"}=err;
    res.status(statusCode).render("./listings/error.ejs",{err});
    //res.status(statusCode).send(message);
    
});

app.listen(8080,(req,res)=>
{
       console.log(`Succesfully listening to the `);
});

// let {title,description,image,price,country,location}=req.body; this is one method of accessing and editing it
        // if(!req.body.listing)
        // {
        //     throw new ExpressError(400,"Send a valid data for listing");
        // } no need of writing like this to check every conditions
        // if(!req.body.title)
        //     {
        //         throw new ExpressError(400,"Send a valid data for listing");
        //     } 

// this help remove the only review part from the code
// db.listings.updateMany(
//     { _id: { $in: [ ObjectId('66e027cfd94bad24b33059a1'), ObjectId('66e027cfd94bad24b33059a2'), ObjectId('66eafebe538c223541013f5e') ] } },
//     { $unset: { reviews: "" } }
//   );
  