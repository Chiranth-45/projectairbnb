const express=require("express");

const path=require("path");
const cookieParser=require("cookie-parser");//npm package is required to get cookies 

const users=require("./routes/user.js");
const posts=require("./routes/posts.js");
const session=require("express-session");//storing session id to send id  to server and getting back them when comeback to browser   
//app.use(cookieParser("sercetcode"));//midleware is required to parse cookies
const flash = require("connect-flash");
const { name } = require("ejs");
const app=express();                           
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(flash());


app.use(session({secret:"mysupersecretcode",   // Secret used to sign the session ID cookie
    resave: false,            // Forces the session to be saved back to the store
    saveUninitialized: true,  // Forces uninitialized sessions to be saved
    cookie: { secure: false }
}));

app.use((req,res,next)=>
{
  res.locals.SuccessMsg=req.flash("success");
  res.locals.ErrorMsg=req.flash("error");
  next();//important to call it...

});

app.get("/test",(req,res)=>
{
    res.send("test sucessfully created");

});

app.get("/reqcount",(req,res)=>
{
    if(req.session.count)
    {
        req.session.count++;
    }
   else{
    req.session.count=1;
   }
   res.send(`you sent a ${req.session.count}`);

});

app.get('/set-session', (req, res) => {
    req.session.username = 'Chiranth';
    res.send('Session data set');
  });
  
  // Route that reads session data
  app.get('/get-session', (req, res) => {
    res.send(`Username from session: ${req.session.username}`);
  });

app.get("/register",(req,res)=>
{
    let {name="anyomous"}=req.query;
    req.session.name=name;
    if(name==="anyomous")
    {
      req.flash("error", "You are  not logged in");

    }
    else{
      req.flash("success", "You have successfully logged in!");

    }
    
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>
{
  
  res.render("page.ejs",{name:req.session.name});

    //res.send( `hello,${req.session.name}`);

});
app.get('/login', (req, res) => {
    // Store user information in the session
    req.session.user = {
      username: 'Chiranth',
      role: 'admin',
      email: 'chiranth@example.com'
    };
    req.session.isLoggedIn = true; // Set login status
    res.send('User logged in and session data saved.');
  });

  app.get('/dashboard', (req, res) => {
    // Check if user is logged in
    if (req.session.isLoggedIn) {
      res.send(`Welcome ${req.session.user.username}, your role is ${req.session.user.role}`);
    } else {
      res.send('Please log in to access the dashboard.');
    }
  });

  app.get('/update-role', (req, res) => {
    if (req.session.isLoggedIn) {
      // Modify session data
      req.session.user.role = 'superadmin';
      res.send('User role updated to superadmin.');
    } else {
      res.send('Please log in to update your role.');
    }
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.send('Error logging out.');
      }
      res.send('Logged out successfully.');
    });
  });
  


app.listen(3030,(req,res)=>
{
    console.log(`Succesfully listening to the `);
});
        
// app.use("/users",users);//to get the / request this will move there
// app.use("/posts",posts);//setted  the common path posts for the posts.js  file and all the route will have it

// app.get("/getcookies",(req,res)=>
// {
//     res.cookie("greet","namaste");
//     res.cookie("origin","India");
//     res.send("sent some cookies");

// });

// app.get("/getsignedcookie",(req,res)=>
//     {
       
//         res.cookie("made-in-India","India",{signed:true});
//         res.send("sent signed cookies");
    
//     });

//     app.get("/verify",(req,res)=>
//         {
//             console.log(req.cookies);
//             console.log(req.signedCookies);
//             res.send("cookies verified");
        
//         });

// app.get("/greet",(req,res)=>
//     {
//         let {name = "anyonomous" }=req.cookies;
//         res.send(`hello ${name}`);
    
//     });


// app.get("/",(req,res)=>
// {
//     console.dir(req.cookies);
//     res.send("get the cookies");

// });


