import { api } from './apiHelper';

/**
 * EditorialCreateDTO (para crear/editar):
 * {
 *   name: "Editorial Planeta", // string, requerido
 *   active: true // boolean, opcional (default: true)
 * }
 *
 * EditorialResponseDTO (respuesta):
 * {
 *   id: 1,
 *   name: "Editorial Planeta",
 *   active: true
 * }
 */

// Listar editoriales
export const getEditorials      = ()             => api.get('/api/editorials');
// Obtener por ID
export const getEditorialById   = id             => api.get(`/api/editorials/${id}`);
// Crear editorial
export const createEditorial    = editorialData  => api.post('/api/editorials', editorialData);
// Actualizar editorial
export const updateEditorial    = (id, data)     => api.put(`/api/editorials/${id}`, data);
// Eliminar editorial
export const deleteEditorial    = id             => api.delete(`/api/editorials/${id}`);
