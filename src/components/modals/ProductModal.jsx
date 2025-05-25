import React, { useEffect, useState } from "react";
import Modal from "../UI/Modal";
import { toast } from "react-toastify";
import {
  createProduct,
  updateProduct,
  getProductById,
} from "../../api/product"
import { getCategories } from "../../api/category";
import { getAuthors } from "../../api/author";
import { getEditorials } from "../../api/editorial";
import { PhotoIcon } from "@heroicons/react/24/outline";

/**
 * Modal para crear o editar producto
 *
 * @param {{
 *   trigger: React.ReactNode,
 *   productId?: number,
 *   product?: object, // Si ya tienes los datos
 *   onSaved?: (product) => void,
 *   mode?: "create" | "edit"
 *   size?: "sm"|"md"|"lg"|"xl"
 * }} props
 */
export default function ProductModal({
  trigger,
  productId,
  product: productProp,
  onSaved,
  mode: modeProp,
  size = "lg",
}) {
  // Estado del producto en edición/creación
  const isEdit = !!(productId || productProp || modeProp === "edit");
  const [product, setProduct] = useState(
    productProp || {
      title: "",
      isbn: "",
      code: "",
      imageUrl: "",
      authorId: "",
      categoryId: "",
      editorialId: "",
      price: "",
      stock: "",
      description: "",
      publicationDate: "",
      active: true,
    }
  );
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [editorials, setEditorials] = useState([]);

  // Para precargar en modo edición
  useEffect(() => {
    if (isEdit && productId && !productProp) {
      setLoading(true);
      getProductById(productId)
        .then((res) => {
          // Mapear al formato del formulario
          const p = res;
          setProduct({
            title: p.title || "",
            isbn: p.isbn || "",
            code: p.code || "",
            imageUrl: p.imageUrl || "",
            authorId: p.author?.id || "",
            categoryId: p.category?.id || "",
            editorialId: p.editorial?.id || "",
            price: p.price || "",
            stock: p.stock || "",
            description: p.description || "",
            publicationDate: p.publicationDate || "",
            active: p.active ?? true,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [productId, productProp, isEdit]);

  useEffect(() => {
    getCategories().then(setCategories);
    getAuthors().then(setAuthors);
    getEditorials().then(setEditorials);
  }, []);

  // Manejadores
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validación básica
  const validate = () => {
    if (!product.title.trim()) return "El título es requerido";
    if (!product.isbn.trim()) return "El ISBN es requerido";
    if (!product.code.trim()) return "El código es requerido";
    if (!product.authorId) return "Selecciona un autor";
    if (!product.categoryId) return "Selecciona una categoría";
    if (!product.editorialId) return "Selecciona una editorial";
    if (!product.price || isNaN(Number(product.price)))
      return "Precio inválido";
    if (!product.stock || isNaN(Number(product.stock)))
      return "Stock inválido";
    return null;
  };

  // Guardar
  const handleSubmit = async (closeModal) => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    try {
      let saved;
      if (isEdit) {
        saved = await updateProduct(productId || productProp?.id, {
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
        });
        toast.success("Producto actualizado");
      } else {
        saved = await createProduct({
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
        });
        toast.success("Producto creado");
      }
      onSaved?.(saved);
      closeModal?.();
    } catch (err) {
      toast.error(
        "Error al " + (isEdit ? "actualizar" : "crear") + " el producto"
      );
    } finally {
      setLoading(false);
    }
  };

  // Contenido del formulario
  const form = (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Título */}
        <div>
          <label className="font-semibold">Título *</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            required
          />
        </div>
        {/* ISBN */}
        <div>
          <label className="font-semibold">ISBN *</label>
          <input
            type="text"
            name="isbn"
            value={product.isbn}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            required
          />
        </div>
        {/* Código */}
        <div>
          <label className="font-semibold">Código *</label>
          <input
            type="text"
            name="code"
            value={product.code}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            required
          />
        </div>
        {/* Imagen URL */}
        <div>
          <label className="font-semibold">URL Imagen</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              placeholder="https://"
            />
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt="img"
                className="w-12 h-12 object-cover rounded shadow border"
              />
            )}
            {!product.imageUrl && (
              <PhotoIcon className="w-10 h-10 text-gray-300" />
            )}
          </div>
        </div>
        {/* Autor */}
        <div>
          <label className="font-semibold">Autor *</label>
          <select
            name="authorId"
            value={product.authorId}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            required
          >
            <option value="">Seleccionar...</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        {/* Categoría */}
        <div>
          <label className="font-semibold">Categoría *</label>
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            required
          >
            <option value="">Seleccionar...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {/* Editorial */}
        <div>
          <label className="font-semibold">Editorial *</label>
          <select
            name="editorialId"
            value={product.editorialId}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            required
          >
            <option value="">Seleccionar...</option>
            {editorials.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        {/* Precio */}
        <div>
          <label className="font-semibold">Precio *</label>
          <input
            type="number"
            name="price"
            value={product.price}
            min={0}
            step={0.01}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            required
          />
        </div>
        {/* Stock */}
        <div>
          <label className="font-semibold">Stock *</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            min={0}
            step={1}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            required
          />
        </div>
        {/* Publicación */}
        <div>
          <label className="font-semibold">Fecha de publicación</label>
          <input
            type="date"
            name="publicationDate"
            value={product.publicationDate || ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>
        {/* Activo */}
        <div className="flex items-center gap-2 mt-5">
          <input
            type="checkbox"
            name="active"
            checked={product.active}
            onChange={handleChange}
            id="active"
            className="form-checkbox"
          />
          <label htmlFor="active" className="font-semibold">
            Activo
          </label>
        </div>
      </div>
      {/* Descripción */}
      <div>
        <label className="font-semibold">Descripción</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 mt-1"
          rows={2}
        />
      </div>
    </form>
  );

  return (
    <Modal
      trigger={trigger}
      title={isEdit ? "Editar producto" : "Crear producto"}
      size={size}
      actions={[
        {
          label: isEdit ? "Actualizar" : "Crear",
          className: "bg-blue-600 text-white hover:bg-blue-700",
          closeOnClick: false,
          onClick: (closeModal) => handleSubmit(closeModal),
        },
        {
          label: "Cancelar",
          className: "bg-gray-200 text-gray-700 hover:bg-gray-300",
          closeOnClick: true,
        },
      ]}
    >
      {loading ? (
        <div className="text-center py-6 text-gray-500">Cargando...</div>
      ) : (
        form
      )}
    </Modal>
  );
}
