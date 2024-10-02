const express=require("express");
const router=express.Router();//for the structured way for analyzing the data properly

//Index-users
router.get("/",(req,res)=>
{
    res.send("GEt for the users");

});

//show -users
router.get("/:id",(req,res)=>
{
    res.send("GET for show users");

});

//show -users post
router.post("/",(req,res)=>
{
        res.send("post  for show users");
    
});

//delete route
router.delete("/",(req,res)=>
{
            res.send("delete for show users");
        
});

module.exports=router;