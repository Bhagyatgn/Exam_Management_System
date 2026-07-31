import {useEffect,useState} from "react";

import ModuleForm from "./ModuleForm";
import ModuleTable from "./ModuleTable";

import {
fetchAllModules,
createNewModule,
editModule,
removeModule
}
from "./moduleService";


interface Module {

id?: string;

course_code:string;

course_name:string;

description?:string;

}



export default function ModulePage(){


const [modules,setModules] =
useState<Module[]>([]);



const [editingModule,setEditingModule] =
useState<Module | null>(null);



const [loading,setLoading] =
useState<boolean>(false);



const loadModules = async()=>{

try{

setLoading(true);

const data:Module[] = await fetchAllModules();

setModules(data);


}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};
