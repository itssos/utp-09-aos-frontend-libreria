import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, deleteProduct, updateProductActive } from "../../api/product";
import { getCategories } from "../../api/category";
import { getAuthors } from "../../api/author";
import { getEditorials } from "../../api/editorial";
import ConfirmModal from "../../components/modals/ConfirmModal";
import ProductModal from "../../components/modals/ProductModal"


// HEROICONS
import { TrashIcon, EyeIcon, PencilSquareIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const DEFAULT_SIZE = 10;

const ProductTableAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [tableReload, setTableReload] = useState(0);


  const filtersFromParams = () => ({
    title: searchParams.get("title") || "",
    categoryId: searchParams.get("categoryId") || "",
    authorId: searchParams.get("authorId") || "",
    editorialId: searchParams.get("editorialId") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "asc",
    page: parseInt(searchParams.get("page") || 0),
    size: parseInt(searchParams.get("size") || DEFAULT_SIZE)
  });
  const [filters, setFilters] = useState(filtersFromParams);

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null); // ID del producto que está procesando acción

  useEffect(() => {
    setFilters(filtersFromParams());
    // eslint-disable-next-line
  }, [searchParams.toString()]);

  useEffect(() => {
    getCategories().then(setCategories);
    getAuthors().then(setAuthors);
    getEditorials().then(setEditorials);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { ...filters };
    Object.keys(params).forEach(key =>
      (params[key] === "" || params[key] === null || (typeof params[key] === "number" && isNaN(params[key]))) && delete params[key]
    );
    getProducts(params)
      .then(res => {
        setProducts(res.content || []);
        setTotalPages(res.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [filters, tableReload]);

  // Sincronización con la URL
  const updateFilter = (name, value) => {
    const newFilters = { ...filters, [name]: value, page: 0 };
    setSearchParams(
      Object.fromEntries(
        Object.entries(newFilters).filter(
          ([k, v]) => v !== "" && v !== null && v !== undefined && v !== "0"
        )
      )
    );
  };
  const changePage = (newPage) => {
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      page: newPage
    });
  };
  const clearFilters = () => setSearchParams({});

  // ACCIÓN: Eliminar producto
  const handleDelete = async (product) => {
    setProcessing(product.id);
    try {
      await deleteProduct(product.id);
      setProducts(products => products.filter(p => p.id !== product.id));
      toast.success(`Producto eliminado: "${product.title}"`);
    } catch (err) {
      toast.error("Error al eliminar producto");
    } finally {
      setProcessing(null);
    }
  };


  // ACCIÓN: Cambiar estado activo/inactivo
  const handleToggleActive = async (product) => {
    setProcessing(product.id);
    try {
      await updateProductActive(product.id, !product.active);
      setProducts(products =>
        products.map(p => p.id === product.id ? { ...p, active: !p.active } : p)
      );
    } finally {
      setProcessing(null);
    }
  };

  const reloadTable = () => {
    setTableReload(r => r + 1);
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-10 shadow-slate-300 shadow-2xl rounded-4xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className=" md:flex md:justify-between md:items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            Administración de Productos
          </h1>
          <ProductModal
            trigger={<button className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-400">Nuevo producto</button>}
            onSaved={reloadTable}
          />
        </div>
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow p-4 mb-8 flex flex-wrap gap-4 justify-center items-end">
          <input
            name="title"
            placeholder="Buscar por título..."
            className="border border-gray-300 rounded-lg px-3 py-2 w-44"
            value={filters.title}
            onChange={e => updateFilter("title", e.target.value)}
          />
          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={e => updateFilter("categoryId", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-36"
          >
            <option value="">Categoría</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            name="authorId"
            value={filters.authorId}
            onChange={e => updateFilter("authorId", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-36"
          >
            <option value="">Autor</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select
            name="editorialId"
            value={filters.editorialId}
            onChange={e => updateFilter("editorialId", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-36"
          >
            <option value="">Editorial</option>
            {editorials.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <input
            type="number"
            name="minPrice"
            placeholder="Precio mínimo"
            className="border border-gray-300 rounded-lg px-3 py-2 w-28"
            value={filters.minPrice}
            onChange={e => updateFilter("minPrice", e.target.value)}
            min={0}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Precio máximo"
            className="border border-gray-300 rounded-lg px-3 py-2 w-28"
            value={filters.maxPrice}
            onChange={e => updateFilter("maxPrice", e.target.value)}
            min={0}
          />
          <select
            name="sort"
            value={filters.sort}
            onChange={e => updateFilter("sort", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-28"
          >
            <option value="asc">Precio ↑</option>
            <option value="desc">Precio ↓</option>
          </select>
          <button
            className="ml-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm px-3 py-2 rounded-lg border"
            onClick={clearFilters}
            type="button"
          >
            Limpiar filtros
          </button>

        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-4 text-left">Imagen</th>
                <th className="py-3 px-4 text-left">Título</th>
                <th className="py-3 px-4 text-left">Autor</th>
                <th className="py-3 px-4 text-left">Categoría</th>
                <th className="py-3 px-4 text-left">Editorial</th>
                <th className="py-3 px-4 text-center">Precio</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Activo</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-400">
                    Cargando productos...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-400">
                    No hay productos para mostrar.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-t hover:bg-slate-50 transition">
                    <td className="py-2 px-4">
                      <img
                        src={product.imageUrl || "https://placehold.co/60x80?text=Sin+Imagen"}
                        alt={product.title}
                        className="w-14 h-20 object-cover rounded-md"
                        loading="lazy"
                      />
                    </td>
                    <td className="py-2 px-4 font-medium">{product.title}</td>
                    <td className="py-2 px-4">{product.author?.name}</td>
                    <td className="py-2 px-4">{product.category?.name}</td>
                    <td className="py-2 px-4">{product.editorial?.name}</td>
                    <td className="py-2 px-4 text-center text-emerald-600 font-semibold">${product.price}</td>
                    <td className="py-2 px-4 text-center">
                      {product.stock > 0 ? (
                        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded">{product.stock}</span>
                      ) : (
                        <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Agotado</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        title={product.active ? "Desactivar" : "Activar"}
                        className={`rounded-full p-1 transition
                          ${product.active
                            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            : "bg-red-50 hover:bg-red-100 text-red-700"
                          }
                          ${processing === product.id ? "opacity-60 pointer-events-none" : ""}
                        `}
                        onClick={() => handleToggleActive(product)}
                        disabled={processing === product.id}
                      >
                        {product.active
                          ? <CheckCircleIcon className="w-6 h-6" />
                          : <XCircleIcon className="w-6 h-6" />
                        }
                      </button>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <ProductModal
                        trigger={
                          <button className="text-yellow-600 hover:bg-yellow-100 rounded p-1">
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                        }
                        productId={product.id}
                        onSaved={reloadTable}
                      />

                      <ConfirmModal
                        trigger={
                          <button
                            className="inline-flex items-center justify-center text-red-600 hover:bg-red-100 rounded p-1"
                            title="Eliminar"
                            disabled={processing === product.id}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        }
                        title="¿Eliminar producto?"
                        message={`¿Seguro que deseas eliminar "${product.title}"? Esta acción no se puede deshacer.`}
                        confirmLabel="Eliminar"
                        cancelLabel="Cancelar"
                        size="sm"
                        confirmClassName="bg-red-600 text-white hover:bg-red-700"
                        onConfirm={() => handleDelete(product)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          <button
            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-gray-700 disabled:opacity-50"
            disabled={filters.page === 0}
            onClick={() => changePage(filters.page - 1)}
          >Anterior</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded-lg border ${filters.page === idx ? "bg-blue-600 text-white" : "bg-slate-100 text-gray-700"}`}
              onClick={() => changePage(idx)}
            >{idx + 1}</button>
          ))}
          <button
            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-gray-700 disabled:opacity-50"
            disabled={filters.page === totalPages - 1 || totalPages <= 1}
            onClick={() => changePage(filters.page + 1)}
          >Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default ProductTableAdmin;
