const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("../models/review.js");

main()
.then( ()=>{console.log("Connection is succesfull");})
.catch((err) => console.log(err));

async function main() { await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust'); }

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    image: {
        filename: String,
        url: { 
            type: String,
            default:
              "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: (v) =>
              v === ""
                ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                : v,
        
        },//this are the changes that are done here check the data.js where it is stored as filename and url
    },
    price: Number,
    location: String,
    country: String,
    //another model is created to add review to picture
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review",
      },
    ],

});

listingSchema.post("findOneAndDelete",async(listing)=>  {
  if(listing)
  {
    await Review.deleteMany({_id: {$in:listing.reviews} });
  }

});

const Listing = mongoose.model('Listing', listingSchema);
module.exports=Listing;

   


