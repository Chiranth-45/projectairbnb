const mongoose=require("mongoose");
const Schema=mongoose.Schema;
main()
.then( ()=>{console.log("Connection is succesfull");})
.catch((err) => console.log(err));

async function main() { await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust'); }

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
        },
    createdAt:
    {
        type:Date,
        default:Date.now(),
    },
});

module.exports=mongoose.model("Review",reviewSchema);