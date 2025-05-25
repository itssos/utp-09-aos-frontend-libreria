import { api } from './apiHelper';

/**
 * CategoryCreateDTO (para crear/editar):
 * {
 *   name: "Electrónica", // string, requerido
 *   description: "Dispositivos electrónicos y gadgets", // string, opcional
 *   active: true // boolean, opcional (default: true)
 * }
 *
 * CategoryResponseDTO (respuesta):
 * {
 *   id: 1,
 *   name: "Electrónica",
 *   description: "Dispositivos electrónicos y gadgets",
 *   active: true
 * }
 */

// Listar categorías
export const getCategories      = ()            => api.get('/api/categories');
// Obtener por ID
export const getCategoryById    = id            => api.get(`/api/categories/${id}`);
// Crear categoría
export const createCategory     = categoryData  => api.post('/api/categories', categoryData);
// Actualizar categoría
export const updateCategory     = (id, data)    => api.put(`/api/categories/${id}`, data);
// Eliminar categoría
export const deleteCategory     = id            => api.delete(`/api/categories/${id}`);
