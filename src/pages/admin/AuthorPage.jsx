import React, { useEffect, useState } from "react";
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../../api/author";
import Modal from "../../components/UI/Modal";
import { toast } from "react-toastify";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import ConfirmModal from "../../components/modals/ConfirmModal";

// --- Modal para crear/editar autor ---
function AuthorModal({ trigger, author, onSaved, size = "sm" }) {
  const [data, setData] = useState(
    author || { name: "", bio: "", active: true }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (author) setData(author);
  }, [author]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((d) => ({
      ...d,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (closeModal) => {
    if (!data.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    setLoading(true);
    try {
      let saved;
      if (author && author.id) {
        saved = await updateAuthor(author.id, data);
        toast.success("Autor actualizado");
      } else {
        saved = await createAuthor(data);
        toast.success("Autor creado");
      }
      onSaved?.();
      closeModal?.();
    } catch (e) {
      toast.error("Error al guardar autor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      trigger={trigger}
      title={author ? "Editar autor" : "Nuevo autor"}
      size={size}
      actions={[
        {
          label: author ? "Actualizar" : "Crear",
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
        <div className="text-center py-6 text-gray-500">Guardando...</div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <label className="font-semibold">Nombre *</label>
            <input
              name="name"
              type="text"
              value={data.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              required
            />
          </div>
          <div>
            <label className="font-semibold flex items-center gap-1">
              <InformationCircleIcon className="w-4 h-4 text-blue-400" />
              Biografía
            </label>
            <textarea
              name="bio"
              value={data.bio}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              rows={2}
            />
          </div>
          {/* <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={!!data.active}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="active" className="font-semibold">
              Activo
            </label>
          </div> */}
        </form>
      )}
    </Modal>
  );
}

// --- Página principal ---
const AuthorPage = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setLoading(true);
    getAuthors()
      .then(setAuthors)
      .finally(() => setLoading(false));
  }, [reload]);

  const reloadTable = () => setReload((n) => n + 1);

  const handleDelete = async (author) => {
    setProcessing(author.id);
    try {
      await deleteAuthor(author.id);
      toast.success("Autor eliminado");
      reloadTable();
    } catch (e) {
      toast.error("No se pudo eliminar");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-10 shadow-slate-300 shadow-2xl rounded-4xl">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UserIcon className="w-8 h-8 text-blue-500" /> Autores
          </h1>
          <AuthorModal
            trigger={
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                <PlusIcon className="w-5 h-5" />
                Nuevo autor
              </button>
            }
            onSaved={reloadTable}
          />
        </div>
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Biografía</th>
                {/* <th className="py-3 px-4 text-center">Activo</th> */}
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : authors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    No hay autores para mostrar.
                  </td>
                </tr>
              ) : (
                authors.map((author) => (
                  <tr key={author.id} className="border-t hover:bg-slate-50 transition">
                    <td className="py-2 px-4">{author.id}</td>
                    <td className="py-2 px-4">{author.name}</td>
                    <td className="py-2 px-4">{author.bio}</td>
                    {/* <td className="py-2 px-4 text-center">
                      {author.active
                        ? <CheckCircleIcon className="w-6 h-6 text-emerald-500 inline" title="Activo" />
                        : <XCircleIcon className="w-6 h-6 text-red-400 inline" title="Inactivo" />
                      }
                    </td> */}
                    <td className="py-2 px-4 text-center flex gap-1 justify-center">
                      <AuthorModal
                        trigger={
                          <button className="text-yellow-600 hover:bg-yellow-100 rounded p-1" title="Editar">
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                        }
                        author={author}
                        onSaved={reloadTable}
                      />
                      <ConfirmModal
                        trigger={
                          <button
                            className="inline-flex items-center justify-center text-red-600 hover:bg-red-100 rounded p-1"
                            title="Eliminar"
                            disabled={processing === author.id}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        }
                        title="¿Eliminar autor?"
                        message={`¿Seguro que deseas eliminar "${author.name}"?`}
                        confirmLabel="Eliminar"
                        cancelLabel="Cancelar"
                        size="sm"
                        confirmClassName="bg-red-600 text-white hover:bg-red-700"
                        onConfirm={() => handleDelete(author)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
