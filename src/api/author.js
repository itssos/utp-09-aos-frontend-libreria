import { api } from './apiHelper';

/**
 * AuthorCreateDTO (para crear/editar):
 * {
 *   name: "Gabriel García Márquez", // string, requerido
 *   bio: "Escritor y periodista colombiano, autor de 'Cien años de soledad'.", // string, opcional
 *   active: true // boolean, opcional (default: true)
 * }
 *
 * AuthorResponseDTO (respuesta):
 * {
 *   id: 1,
 *   name: "Gabriel García Márquez",
 *   bio: "Escritor y periodista...",
 *   active: true
 * }
 */

// Obtener todos los autores
export const getAuthors      = ()           => api.get('/api/authors');
// Obtener autor por ID
export const getAuthorById   = id           => api.get(`/api/authors/${id}`);
// Crear autor
export const createAuthor    = authorData   => api.post('/api/authors', authorData);
// Actualizar autor
export const updateAuthor    = (id, data)   => api.put(`/api/authors/${id}`, data);
// Eliminar autor
export const deleteAuthor    = id           => api.delete(`/api/authors/${id}`);
