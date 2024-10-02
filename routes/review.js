const express=require("express");
const router=express.Router({mergeParams:true});//this merge Paramas help to pass the parameter which is used in child part ..this is also important

const WrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../Schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");



const Validatereview=(req,res,next)=>
    {
        let {error}=reviewSchema.validate(req.body);
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

    
//REviews Post Reviw Route is here
router.post("/",Validatereview,WrapAsync(async(req,res,next)=>
    {
        //console.log(req.params.id);
        let listing=await Listing.findById(req.params.id);
        let newReview=new Review(req.body.review);
    
        listing.reviews.push(newReview);
    
        await newReview.save();
        await listing.save();
    
        console.log("new review saved");
        //res.send("new review saved");
        req.flash("success","new review added succesfully");
    
        res.redirect(`/listings/${listing._id}`);
    
    
}));
    
    //Delete Review Route
router.delete("/:reviewId",WrapAsync(async(req,res)=>
{
        let {id,reviewId}=req.params;
    
        // await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//this helps to delete and update the listing
        // await Review.findOneAndDelete(reviewId);

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","deleted succesfully");
        
    
        res.redirect(`/listings/${id}`);
    
})
);

module.exports=router;