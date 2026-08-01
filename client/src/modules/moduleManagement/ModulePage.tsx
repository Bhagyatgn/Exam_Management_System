import { useEffect, useState } from "react";
import ModuleForm from "./ModuleForm";
import ModuleTable from "./ModuleTable";
import {
  fetchAllModules,
  createNewModule,
  editModule,
  removeModule
} from "./moduleService";

interface Module {
  id?: string;
  course_code: string;
  course_name: string;
  description?: string;
}

export default function ModulePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadModules = async () => {
    try {
      setLoading(true);
      const data: Module[] = await fetchAllModules();
      setModules(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleSave = async (mod: Module) => {
    if (editingModule && editingModule.id) {
      await editModule(editingModule.id, mod);
    } else {
      await createNewModule(mod);
    }
    setEditingModule(null);
    loadModules();
  };

  const handleEdit = (mod: Module) => {
    setEditingModule(mod);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await removeModule(id);
      loadModules();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Module Management</h2>
      <ModuleForm 
        onSubmit={handleSave} 
        initialData={editingModule || undefined}
        onCancel={() => setEditingModule(null)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ModuleTable 
          modules={modules} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
}

