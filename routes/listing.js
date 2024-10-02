const express=require("express");
const router=express.Router();

//const app=express();
//app.use(express.json()); // For JSON payloads
//app.use(express.urlencoded({ extended: true })); // For form data (URL-encoded)

const WrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../Schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

//to handle the server side validation throgh JOi object for listing model
const ValidateListing=(req,res,next)=>
    {
        let {error}=listingSchema.validate(req.body);
        //console.log(result);//to know the deatils of it
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
    }  



//index route
router.get("/", WrapAsync(async (req, res) =>{
    const alllistings = await Listing.find({});//we can do .then also
    res.render("./listings/index.ejs",{alllistings});

}));

//new listinings  route
router.get("/new",(req,res)=>
{
    res.render("./listings/new.ejs");

});

//adding new listings
router.post("/", ValidateListing,WrapAsync(async(req,res)=>
{
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","New listing Added");
    res.redirect("/listings");
}));

    
//show route
router.get("/:id",WrapAsync(async (req,res)=>
{
    let {id}=req.params; 
    let listing= await Listing.findById(id).populate("reviews");
    if(!listing)
        {
          req.flash("error","listing not found");
        }
    res.render("./listings/show.ejs",{listing:listing});
    
}));


router.get("/:id/edit",WrapAsync(async (req,res)=>
{
        let {id}=req.params;
        let listing= await Listing.findById(id);
      if(!listing)
      {
        req.flash("error","listing not found");
      }
        res.render("./listings/edit.ejs",{listing});
       
}));

router.put("/:id",ValidateListing,WrapAsync(async (req,res)=>
{
    let {id}=req.params;
    if(!req.body.listing)
        {
            throw new ExpressError(400,"Send a valid data for listing");
        }    
   
    await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});//spreading data
    req.flash("success","updated succesfully");
    //res.redirect("/listings");
    res.redirect(`/listings/${id}`);//we redirect to any of the pages of the both 
    
}));



//delete route
router.delete("/:id", WrapAsync(async (req, res) => {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","deleted succesfully");
    res.redirect("/listings");

}));


  module.exports=router;