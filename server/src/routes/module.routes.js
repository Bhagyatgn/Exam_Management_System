const express=require("express");

const router=express.Router();


const controller=require("../controllers/module.controller");



router.get(
"/",
controller.getModules
);



router.post(
"/",
controller.createModule
);



router.put(
"/:id",
controller.updateModule
);



router.delete(
"/:id",
controller.deleteModule
);



module.exports=router;