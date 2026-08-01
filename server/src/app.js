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
app.get("/api/health",(req,res)=>{

    res.json({
        message:"Exam Management API is running"
    });

});



// Authentication APIs
app.use(
    "/api/auth",
    authRoutes
);



const path = require("path");

// Module APIs
app.use(
    "/api/modules",
    moduleRoutes
);

const distPath = path.join(__dirname, "../../client/dist");
app.use(express.static(distPath));

// SPA Fallback
app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

module.exports = app;