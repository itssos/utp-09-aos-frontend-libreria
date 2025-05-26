import React, { useEffect, useState } from "react";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../../api/user";
import { toast } from "react-toastify";
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/UI/Modal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { getRoles } from "../../api/roles";


function UserDetailModal({ trigger, userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserById(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Modal trigger={trigger} title="Detalle de usuario" size="lg">
      {loading ? (
        <div className="text-center py-6 text-gray-500">Cargando...</div>
      ) : !user ? (
        <div className="text-center py-6 text-gray-400">Usuario no encontrado.</div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="font-semibold">Nombre:</span> {user.firstName} {user.lastName}
            </div>
            <div>
              <span className="font-semibold">DNI:</span> {user.dni}
            </div>
            <div>
              <span className="font-semibold">Género:</span> {user.gender}
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="font-semibold">Dirección:</span> {user.address}
            </div>
            <div>
              <span className="font-semibold">Teléfono:</span> {user.phone}
            </div>
            <div>
              <span className="font-semibold">Fecha Nacimiento:</span>{" "}
              {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : "-"}
            </div>
          </div>
          <hr />
          <div>
            <div className="font-semibold">Usuario</div>
            <div>
              <span className="font-semibold">Username:</span> {user.user?.username}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.user?.email}
            </div>
            <div>
              <span className="font-semibold">Rol:</span> {user.user?.role}
            </div>
            <div>
              <span className="font-semibold">Permisos:</span>{" "}
              <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                {user.user?.permissions?.join(", ") || "-"}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// Formulario para crear/editar usuario y persona
function UserFormModal({ trigger, userId, onSaved }) {
  const isEdit = !!userId;
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    gender: "MASCULINO",
    address: "",
    phone: "",
    birthDate: "",
    user: {
      username: "",
      email: "",
      password: "",
      role: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      getUserById(userId)
        .then((user) => {
          setData({
            ...user,
            user: {
              username: user.user?.username || "",
              email: user.user?.email || "",
              password: "",
              role: user.user?.role || ""
            }
          });
        })
        .finally(() => setLoading(false));
    } else {
      setData({
        firstName: "",
        lastName: "",
        dni: "",
        gender: "MASCULINO",
        address: "",
        phone: "",
        birthDate: "",
        user: {
          username: "",
          email: "",
          password: "",
          role: ""
        }
      });
    }
    // eslint-disable-next-line
    getRoles().then(setRoles);
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("user.")) {
      setData((d) => ({
        ...d,
        user: {
          ...d.user,
          [name.slice(5)]: value
        }
      }));
    } else {
      setData((d) => ({ ...d, [name]: value }));
    }
  };

  const handleSave = async (closeModal) => {
    // Validaciones básicas
    if (!data.firstName.trim() || !data.lastName.trim() || !data.dni.trim() ||
      !data.user.username.trim() || !data.user.email.trim() ||
      (!isEdit && !data.user.password.trim()) || !data.user.role.trim()
    ) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateUser(userId, {
          ...data,
          user: { ...data.user, password: undefined } // No actualiza password si está vacío
        });
        toast.success("Usuario actualizado");
      } else {
        await createUser(data);
        toast.success("Usuario creado");
      }
      onSaved?.();
      closeModal?.();
    } catch {
      toast.error("Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      trigger={trigger}
      title={isEdit ? "Editar usuario" : "Nuevo usuario"}
      size="xl"
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
        }
      ]}
    >
      {loading ? (
        <div className="text-center py-6 text-gray-400">Cargando...</div>
      ) : (
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[220px]">
              <label className="font-semibold">Nombres *</label>
              <input
                name="firstName"
                value={data.firstName}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
                required
              />
            </div>
            <div className="flex-1 min-w-[220px]">
              <label className="font-semibold">Apellidos *</label>
              <input
                name="lastName"
                value={data.lastName}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
                required
              />
            </div>
            <div className="w-32">
              <label className="font-semibold">DNI *</label>
              <input
                name="dni"
                value={data.dni}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
                required
              />
            </div>
            <div className="w-40">
              <label className="font-semibold">Género *</label>
              <select
                name="gender"
                value={data.gender}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
                required
              >
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="font-semibold">Dirección</label>
              <input
                name="address"
                value={data.address}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </div>
            <div className="w-40">
              <label className="font-semibold">Teléfono</label>
              <input
                name="phone"
                value={data.phone}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </div>
            <div className="w-40">
              <label className="font-semibold">Fecha Nacimiento</label>
              <input
                name="birthDate"
                type="date"
                value={data.birthDate}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </div>
          </div>
          <hr />
          <div className="flex gap-4 flex-wrap">
            <div className="w-40">
              <label className="font-semibold">Username *</label>
              <input
                name="user.username"
                value={data.user.username}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
                required
              />
            </div>
            <div className="w-48">
              <label className="font-semibold">Email *</label>
              <input
                name="user.email"
                type="email"
                value={data.user.email}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
                required
              />
            </div>
            {!isEdit && (
              <div className="w-40">
                <label className="font-semibold">Contraseña *</label>
                <input
                  name="user.password"
                  type="password"
                  value={data.user.password}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 mt-1"
                  required
                />
              </div>
            )}
            <div className="w-40">
              <label className="font-semibold">Rol *</label>
              <select
                name="user.role"
                value={data.user.role}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
                required
              >
                <option value="">Seleccionar...</option>
                {roles.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>

          </div>
        </form>
      )}
    </Modal>
  );
}

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(0);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    getUsers().then(setUsers);
  }, [reload]);

  const reloadTable = () => setReload(n => n + 1);

  const handleDelete = async (user) => {
    setProcessing(user.id);
    try {
      await deleteUser(user.id);
      toast.success("Usuario eliminado");
      reloadTable();
    } catch {
      toast.error("No se pudo eliminar usuario");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-3">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">Administrar Usuarios</h1>
          <UserFormModal
            trigger={
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                <PlusIcon className="w-5 h-5" /> Nuevo usuario
              </button>
            }
            onSaved={reloadTable}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Nombre Completo</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t hover:bg-slate-50 transition">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.username}</td>
                  <td className="py-2 px-4">{u.fullName}</td>
                  <td className="py-2 px-4 text-center flex gap-2 justify-center">
                    <UserDetailModal
                      trigger={
                        <button className="text-blue-700 hover:bg-blue-50 rounded p-1" title="Ver detalle">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      }
                      userId={u.id}
                    />
                    <UserFormModal
                      trigger={
                        <button className="text-yellow-600 hover:bg-yellow-100 rounded p-1" title="Editar">
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                      }
                      userId={u.id}
                      onSaved={reloadTable}
                    />
                    <ConfirmModal
                      trigger={
                        <button
                          className="text-red-600 hover:bg-red-100 rounded p-1"
                          title="Eliminar"
                          disabled={processing === u.id}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      }
                      title="¿Eliminar usuario?"
                      message={`¿Seguro que deseas eliminar al usuario "${u.username}"? Esta acción no se puede deshacer.`}
                      confirmLabel="Eliminar"
                      cancelLabel="Cancelar"
                      size="sm"
                      confirmClassName="bg-red-600 text-white hover:bg-red-700"
                      onConfirm={() => handleDelete(u)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
