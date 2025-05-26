import { api } from './apiHelper';

/**
 * Obtiene la lista de todos los roles del sistema (excepto ADMINISTRADOR).
 * 
 * GET /api/roles
 * 
 * @returns {Promise<Array<Role>>}
 * 
 * Respuesta:
 *   200 OK: Array de objetos Role
 *   [
 *     {
 *       id: 2,
 *       name: "DOCENTE",
 *       description: "Rol para los docentes",
 *       permissions: [{ id: 4, name: "GET_USERS", label: "Consultar usuarios" }, ...]
 *     },
 *     ...
 *   ]
 */
export const getRoles = () => api.get('/api/roles');

/**
 * Obtiene el detalle de un rol específico por ID.
 * 
 * GET /api/roles/{id}
 * 
 * @param {number} id - ID del rol a consultar.
 * @returns {Promise<Role>}
 * 
 * Respuesta:
 *   200 OK: Objeto Role
 *   404 Not Found: Si el rol no existe.
 */
export const getRoleById = id => api.get(`/api/roles/${id}`);

/**
 * Crea un nuevo rol con nombre, descripción y permisos.
 * 
 * POST /api/roles
 * 
 * @param {Object} roleData - Objeto con los datos del rol:
 *   {
 *     name:        string (requerido),
 *     description: string,
 *     permissions: Array<{ id: number }>
 *   }
 * @returns {Promise<Role>}
 * 
 * Respuesta:
 *   201 Created: Objeto Role creado.
 *   400 Bad Request: Si los datos son inválidos o violan reglas de negocio.
 */
export const createRole = roleData => api.post('/api/roles', roleData);

/**
 * Actualiza la descripción y permisos de un rol existente.
 * (No se permite cambiar el nombre del rol.)
 * 
 * PUT /api/roles/{id}
 * 
 * @param {number} id - ID del rol a actualizar.
 * @param {Object} roleData - Objeto con los nuevos datos:
 *   {
 *     description: string,
 *     permissions: Array<{ id: number }>
 *   }
 * @returns {Promise<Role>}
 * 
 * Respuesta:
 *   200 OK: Rol actualizado correctamente.
 *   400 Bad Request: Datos inválidos o intento de cambiar el nombre.
 *   404 Not Found: Rol no encontrado.
 */
export const updateRole = (id, roleData) => api.put(`/api/roles/${id}`, roleData);

/**
 * Elimina un rol por su ID.
 * No se puede eliminar los roles protegidos: ADMINISTRADOR, ESTUDIANTE, DOCENTE, APODERADO.
 * 
 * DELETE /api/roles/{id}
 * 
 * @param {number} id - ID del rol a eliminar.
 * @returns {Promise<void>}
 * 
 * Respuesta:
 *   204 No Content: Rol eliminado exitosamente.
 *   400 Bad Request: Si intenta eliminar un rol protegido.
 *   404 Not Found: Rol no encontrado.
 */
export const deleteRole = id => api.delete(`/api/roles/${id}`);

/**
 * Asigna un permiso existente a un rol específico.
 * 
 * POST /api/roles/{roleId}/permissions/{permissionName}
 * 
 * @param {number} roleId - ID del rol.
 * @param {string} permissionName - Nombre del permiso a asignar (ej: "EDITAR_USUARIOS").
 * @returns {Promise<Role>} - Rol actualizado.
 * 
 * Respuesta:
 *   200 OK: Permiso asignado correctamente.
 *   400 Bad Request: Permiso ya asignado o datos inválidos.
 *   404 Not Found: Rol o permiso no encontrado.
 */
export const assignPermissionToRole = (roleId, permissionName) =>
  api.post(`/api/roles/${roleId}/permissions/${permissionName}`);

/**
 * Elimina un permiso previamente asignado a un rol.
 * 
 * DELETE /api/roles/{roleId}/permissions/{permissionName}
 * 
 * @param {number} roleId - ID del rol.
 * @param {string} permissionName - Nombre del permiso a eliminar.
 * @returns {Promise<Role>} - Rol actualizado.
 * 
 * Respuesta:
 *   200 OK: Permiso eliminado correctamente.
 *   400 Bad Request: Permiso no estaba asignado o datos inválidos.
 *   404 Not Found: Rol o permiso no encontrado.
 */
export const removePermissionFromRole = (roleId, permissionName) =>
  api.delete(`/api/roles/${roleId}/permissions/${permissionName}`);

/**
 * ==========================
 * Tipo de Objeto Role (según OpenAPI):
 * {
 *   id:          number,
 *   name:        string,
 *   description: string,
 *   permissions: Array<{
 *     id:    number,
 *     name:  string,
 *     label: string
 *   }>
 * }
 * ==========================
 */
