import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function ModuleTable({ modules, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {modules.map((mod) => (
            <tr key={mod.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mod.course_code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mod.course_name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{mod.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(mod)} className="text-blue-600 hover:text-blue-900 mr-4">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(mod.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {modules.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                No modules found. Create one above!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
