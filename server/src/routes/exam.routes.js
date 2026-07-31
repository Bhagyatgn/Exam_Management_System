const express=require("express");

const router=express.Router();

const {
 authenticate
}=require("../middleware/auth.middleware");


const {
 authorizeRoles
}=require("../middleware/role.middleware");



router.post(
"/create",

authenticate,

authorizeRoles("TEACHER"),

(req,res)=>{

res.json({
message:"Exam created"
});

});


module.exports=router;