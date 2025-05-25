import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/category";
import Modal from "../../components/UI/Modal";
import { toast } from "react-toastify";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import ConfirmModal from "../../components/modals/ConfirmModal";

// --- Modal para crear/editar categoría ---
function CategoryModal({ trigger, category, onSaved, size = "sm" }) {
  const [data, setData] = useState(
    category || { name: "", description: "" }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) setData(category);
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((d) => ({
      ...d,
      [name]: value,
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
      if (category && category.id) {
        saved = await updateCategory(category.id, data);
        toast.success("Categoría actualizada");
      } else {
        saved = await createCategory(data);
        toast.success("Categoría creada");
      }
      onSaved?.();
      closeModal?.();
    } catch (e) {
      toast.error("Error al guardar categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      trigger={trigger}
      title={category ? "Editar categoría" : "Nueva categoría"}
      size={size}
      actions={[
        {
          label: category ? "Actualizar" : "Crear",
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
            <label className="font-semibold">Descripción</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              rows={2}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}

// --- Página principal ---
const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, [reload]);

  const reloadTable = () => setReload((n) => n + 1);

  const handleDelete = async (category) => {
    setProcessing(category.id);
    try {
      await deleteCategory(category.id);
      toast.success("Categoría eliminada");
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Categorías
          </h1>
          <CategoryModal
            trigger={
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                <PlusIcon className="w-5 h-5" />
                Nueva categoría
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
                <th className="py-3 px-4 text-left">Descripción</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400">
                    No hay categorías para mostrar.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-t hover:bg-slate-50 transition">
                    <td className="py-2 px-4">{cat.id}</td>
                    <td className="py-2 px-4">{cat.name}</td>
                    <td className="py-2 px-4">{cat.description}</td>
                    <td className="py-2 px-4 text-center flex gap-1 justify-center">
                      <CategoryModal
                        trigger={
                          <button className="text-yellow-600 hover:bg-yellow-100 rounded p-1" title="Editar">
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                        }
                        category={cat}
                        onSaved={reloadTable}
                      />
                      <ConfirmModal
                        trigger={
                          <button
                            className="inline-flex items-center justify-center text-red-600 hover:bg-red-100 rounded p-1"
                            title="Eliminar"
                            disabled={processing === cat.id}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        }
                        title="¿Eliminar categoría?"
                        message={`¿Seguro que deseas eliminar "${cat.name}"?`}
                        confirmLabel="Eliminar"
                        cancelLabel="Cancelar"
                        size="sm"
                        confirmClassName="bg-red-600 text-white hover:bg-red-700"
                        onConfirm={() => handleDelete(cat)}
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

export default CategoryPage;
