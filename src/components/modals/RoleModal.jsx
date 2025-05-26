import React, { useEffect, useState } from "react";
import Modal from "../UI/Modal";
import { getRoleById, createRole, updateRole } from "../../api/roles";
import { toast } from "react-toastify";

export default function RoleModal({ trigger, roleId, permissions, onSaved, size = "md" }) {
  const isEdit = !!roleId;
  const [data, setData] = useState({
    name: "",
    description: "",
    permissions: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      getRoleById(roleId)
        .then(role => {
          setData({
            name: role.name,
            description: role.description || "",
            permissions: role.permissions.map(p => p.id)
          });
        })
        .finally(() => setLoading(false));
    } else {
      setData({ name: "", description: "", permissions: [] });
    }
    // eslint-disable-next-line
  }, [roleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: value }));
  };

  const handleTogglePermission = (permId) => {
    setData(d => ({
      ...d,
      permissions: d.permissions.includes(permId)
        ? d.permissions.filter(id => id !== permId)
        : [...d.permissions, permId]
    }));
  };

  const handleSave = async (closeModal) => {
    if (!isEdit && !data.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    setLoading(true);
    try {
      const roleData = {
        ...(isEdit ? {} : { name: data.name.trim() }),
        description: data.description,
        permissions: data.permissions.map(id => ({ id }))
      };
      if (isEdit) {
        await updateRole(roleId, roleData);
        toast.success("Rol actualizado");
      } else {
        await createRole(roleData);
        toast.success("Rol creado");
      }
      onSaved?.();
      closeModal?.();
    } catch (e) {
      toast.error("Error al guardar rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      trigger={trigger}
      title={isEdit ? `Editar rol: ${data.name}` : "Crear nuevo rol"}
      size={size}
      actions={[
        {
          label: isEdit ? "Actualizar" : "Crear",
          className: "bg-blue-600 text-white hover:bg-blue-700",
          closeOnClick: false,
          onClick: (closeModal) => handleSave(closeModal),
        },
        {
          label: "Cancelar",
          className: "bg-gray-200 text-gray-700 hover:bg-gray-300",
          closeOnClick: true,
        },
      ]}
    >
      {loading ? (
        <div className="text-center py-6 text-gray-400">Cargando...</div>
      ) : (
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          {!isEdit && (
            <div>
              <label className="font-semibold">Nombre del rol *</label>
              <input
                name="name"
                value={data.name}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
                required
                disabled={isEdit}
                placeholder="Nombre único del rol"
              />
            </div>
          )}
          <div>
            <label className="font-semibold">Descripción</label>
            <input
              name="description"
              value={data.description}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              placeholder="Opcional"
            />
          </div>
          <div>
            <label className="font-semibold">Permisos</label>
            <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto">
              {permissions.map(p => (
                <label key={p.id} className="flex items-center gap-2 text-sm bg-blue-50 px-2 py-1 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.permissions.includes(p.id)}
                    onChange={() => handleTogglePermission(p.id)}
                    className="accent-blue-600"
                  />
                  {p.label || p.name}
                </label>
              ))}
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
