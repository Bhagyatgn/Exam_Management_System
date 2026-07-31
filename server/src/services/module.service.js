const repository=require("../repositories/module.repository");



class ModuleService{


async getModules(){

    return await repository.getAll();

}



async getModule(id){

    return await repository.getById(id);

}



async createModule(data){

    return await repository.create(data);

}




async updateModule(id,data){

    return await repository.update(id,data);

}




async deleteModule(id){

    return await repository.delete(id);

}



}



module.exports=new ModuleService();