module.exports=(fn)=>
{
    return (req,res,next)=>
    {
        fn(req,res,next).catch(next);
    };
};

//better way of implementing the code to avoid the error of try and catch function rather mechanism
