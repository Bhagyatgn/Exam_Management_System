const express = require("express");
const cors = require("cors");


const authRoutes = require("./routes/auth.routes");
const moduleRoutes = require("./routes/module.routes");


const app = express();



app.use(
    cors({
        origin:true,
        credentials:true
    })
);


app.use(express.json());



// Test API
app.get("/",(req,res)=>{

    res.json({
        message:"Exam Management API is running"
    });

});



// Authentication APIs
app.use(
    "/api/auth",
    authRoutes
);



// Module APIs
app.use(
    "/api/modules",
    moduleRoutes
);



module.exports = app;