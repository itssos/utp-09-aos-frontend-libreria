import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPublicProducts } from "../api/product";
import { getCategories } from "../api/category";
import { getAuthors } from "../api/author";
import { getEditorials } from "../api/editorial";
import ProductCard from "../components/ProductCard";

const DEFAULT_SIZE = 20;

const CatalogPage = () => {
  // Sincronía con la URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Catálogos para selects
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [editorials, setEditorials] = useState([]);

  // Data productos y meta
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Lee filtros desde la URL
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

  // Refresca filtros si cambia la url (por navegación)
  useEffect(() => {
    setFilters(filtersFromParams());
    // eslint-disable-next-line
  }, [searchParams.toString()]);

  // Carga catálogos una sola vez
  useEffect(() => {
    getCategories().then(setCategories);
    getAuthors().then(setAuthors);
    getEditorials().then(setEditorials);
  }, []);

  // Actualiza productos cuando cambian los filtros
  useEffect(() => {
    setLoading(true);
    // Quita vacíos
    const params = { ...filters };
    Object.keys(params).forEach(key =>
      (params[key] === "" || params[key] === null || (typeof params[key] === "number" && isNaN(params[key]))) && delete params[key]
    );
    getPublicProducts(params)
      .then(res => {
        setProducts(res.content || []);
        setTotalPages(res.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  // Cambiar filtros y sincronizar con URL
  const updateFilter = (name, value) => {
    const newFilters = { ...filters, [name]: value, page: 0 }; // Cambia filtro, resetea página
    setSearchParams(
      Object.fromEntries(
        Object.entries(newFilters).filter(
          ([k, v]) => v !== "" && v !== null && v !== undefined && v !== "0"
        )
      )
    );
  };
  // Cambiar página
  const changePage = (newPage) => {
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      page: newPage
    });
  };
  // Limpiar filtros
  const clearFilters = () => setSearchParams({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 rounded-4xl shadow-slate-300 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
          Catálogo de Productos
        </h1>
        <p className="text-gray-500 mb-8 text-center">Explora nuestros libros y productos destacados.</p>

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

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No hay productos para mostrar.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 items-stretch">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
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
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
