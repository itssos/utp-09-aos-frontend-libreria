import React, { useEffect, useState } from "react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getRoleById,
} from "../../api/roles";
import { getAllPermissions } from "../../api/permissions";
import { toast } from "react-toastify";
import { PlusIcon, TrashIcon, PencilSquareIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "../../components/modals/ConfirmModal";
import RoleModal from "../../components/modals/RoleModal";

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([getRoles(), getAllPermissions()])
      .then(([rolesRes, permsRes]) => {
        setRoles(rolesRes);
        setPermissions(permsRes);
      })
      .finally(() => setLoading(false));
  }, [reload]);

  const reloadTable = () => setReload(n => n + 1);

  // Eliminar rol
  const handleDelete = async (role) => {
    setProcessing(role.id);
    try {
      await deleteRole(role.id);
      toast.success(`Rol eliminado: "${role.name}"`);
      reloadTable();
    } catch (e) {
      toast.error("No se pudo eliminar el rol (puede estar protegido)");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Administrar Roles</h1>
          <RoleModal
            trigger={
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                <PlusIcon className="w-5 h-5" /> Nuevo rol
              </button>
            }
            permissions={permissions}
            onSaved={reloadTable}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          {loading ? (
            <div className="text-center text-gray-400 py-12">Cargando...</div>
          ) : roles.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No hay roles para mostrar.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Descripción</th>
                  <th className="py-3 px-4 text-center">Permisos</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.id} className="border-t hover:bg-slate-50 transition">
                    <td className="py-2 px-4 font-semibold flex items-center gap-2">
                      <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                      {role.name}
                    </td>
                    <td className="py-2 px-4">{role.description || <span className="text-gray-400">—</span>}</td>
                    <td className="py-2 px-4 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        {role.permissions.length} permiso(s)
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center flex gap-2 justify-center">
                      <RoleModal
                        trigger={
                          <button
                            className="text-yellow-600 hover:bg-yellow-100 rounded p-1"
                            title="Editar"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                        }
                        roleId={role.id}
                        permissions={permissions}
                        onSaved={reloadTable}
                      />
                      <ConfirmModal
                        trigger={
                          <button
                            className="text-red-600 hover:bg-red-100 rounded p-1"
                            title="Eliminar"
                            disabled={processing === role.id}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        }
                        title="¿Eliminar rol?"
                        message={`¿Seguro que deseas eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`}
                        confirmLabel="Eliminar"
                        cancelLabel="Cancelar"
                        size="sm"
                        confirmClassName="bg-red-600 text-white hover:bg-red-700"
                        onConfirm={() => handleDelete(role)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
