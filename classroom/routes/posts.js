const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>
    {
        res.send("GEt for the posts");
    
    });
    
    //show -users
    router.get("/:id",(req,res)=>
    {
        res.send("GET for show posts");
    
    });
    
    //show -users post
    router.post("/",(req,res)=>
    {
            res.send("post  for show posts");
        
    });
    
    //delete route
    router.delete("/",(req,res)=>
    {
                res.send("delete for show posts");
            
    });

    module.exports=router;
        