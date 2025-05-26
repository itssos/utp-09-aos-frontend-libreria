import { api } from './apiHelper';

/**
 * Obtiene la lista completa de todos los permisos registrados en el sistema.
 * 
 * GET /api/permissions
 * 
 * @returns {Promise<Array<Permission>>}
 * 
 * Respuesta:
 *   200 OK: Array de objetos Permission
 *   [
 *     {
 *       id: 1,
 *       name: "GET_USERS",
 *       label: "Consultar usuarios"
 *     },
 *     ...
 *   ]
 */
export const getAllPermissions = () => api.get('/api/permissions');

/**
 * Obtiene el detalle de un permiso específico mediante su ID.
 * 
 * GET /api/permissions/{id}
 * 
 * @param {number} id - ID del permiso a consultar.
 * @returns {Promise<Permission>}
 * 
 * Respuesta:
 *   200 OK: Objeto Permission
 *   404 Not Found: Permiso no encontrado.
 */
export const getPermissionById = id => api.get(`/api/permissions/${id}`);

/**
 * Obtiene un permiso mediante su nombre.
 * 
 * GET /api/permissions/name/{name}
 * 
 * @param {string} name - Nombre interno del permiso (ejemplo: "EDITAR_USUARIOS").
 * @returns {Promise<Permission>}
 * 
 * Respuesta:
 *   200 OK: Objeto Permission
 *   404 Not Found: Permiso no encontrado.
 */
export const getPermissionByName = name => api.get(`/api/permissions/name/${name}`);

/**
 * ==========================
 * Tipo de Objeto Permission (según OpenAPI):
 * {
 *   id:    number,
 *   name:  string,  // Nombre técnico interno (ejemplo: "EDITAR_USUARIOS")
 *   label: string   // Descripción legible (ejemplo: "Editar usuarios")
 * }
 * ==========================
 */
