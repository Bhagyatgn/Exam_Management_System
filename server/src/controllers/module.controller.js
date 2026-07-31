const service=require("../services/module.service");
const {moduleSchema}=require("../validators/module.validator");




exports.getModules=async(req,res)=>{

try{

const data=await service.getModules();

res.json(data);


}catch(error){

res.status(500)
.json({
message:error.message
});

}

};





exports.createModule=async(req,res)=>{


try{


const {error}=moduleSchema.validate(req.body);


if(error)
return res.status(400)
.json({
message:error.message
});



const module=await service.createModule(req.body);


res.status(201)
.json(module);



}catch(error){

res.status(500)
.json({
message:error.message
});

}


};





exports.updateModule=async(req,res)=>{


try{


const data=
await service.updateModule(
req.params.id,
req.body
);


res.json(data);



}catch(error){

res.status(500)
.json({
message:error.message
});

}


};






exports.deleteModule=async(req,res)=>{


try{

await service.deleteModule(req.params.id);


res.json({
message:"Module deleted"
});



}catch(error){

res.status(500)
.json({
message:error.message
});

}


};