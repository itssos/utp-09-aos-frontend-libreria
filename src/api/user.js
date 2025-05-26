import { api } from './apiHelper';

/**
 * Lista todos los usuarios mostrando solo los datos clave (id, username, fullName).
 * 
 * GET /api/users/short
 * 
 * @returns {Promise<Array<UserShortResponseDTO>>}
 * 
 * Respuesta:
 *   200 OK: [
 *     {
 *       id: 5,
 *       username: "epalomino",
 *       fullName: "Eduardo Palomino"
 *     },
 *     ...
 *   ]
 */
export const getUsers = () => api.get('/api/users/short');

/**
 * Obtiene los datos completos de una persona y su usuario asociado por ID.
 * 
 * GET /api/users/{id}
 * 
 * @param {number} id - ID de la persona.
 * @returns {Promise<PersonResponseDTO>}
 * 
 * Respuesta:
 *   200 OK: Objeto PersonResponseDTO
 *   404 Not Found: Persona no encontrada
 */
export const getUserById = id => api.get(`/api/users/${id}`);

/**
 * Crea una nueva persona y su cuenta de usuario asociada.
 * 
 * POST /api/users
 * 
 * @param {PersonCreateDTO} userData - Datos de persona y usuario asociados.
 * @returns {Promise<PersonResponseDTO>}
 * 
 * Respuesta:
 *   201 Created: Persona creada exitosamente (objeto PersonResponseDTO)
 *   400 Bad Request: Error de validación
 */
export const createUser = userData => api.post('/api/users', userData);

/**
 * Actualiza los datos de una persona y su usuario asociado.
 * 
 * PUT /api/users/{id}
 * 
 * @param {number} id - ID de la persona a actualizar.
 * @param {PersonCreateDTO} userData - Nuevos datos de la persona y usuario.
 * @returns {Promise<PersonResponseDTO>}
 * 
 * Respuesta:
 *   200 OK: Persona actualizada correctamente (objeto PersonResponseDTO)
 *   400 Bad Request: Error de validación
 *   404 Not Found: Persona no encontrada
 */
export const updateUser = (id, userData) => api.put(`/api/users/${id}`, userData);

/**
 * Elimina una persona y su usuario asociado.
 * 
 * DELETE /api/users/{id}
 * 
 * @param {number} id - ID de la persona a eliminar.
 * @returns {Promise<void>}
 * 
 * Respuesta:
 *   204 No Content: Persona eliminada correctamente
 *   404 Not Found: Persona no encontrada
 */
export const deleteUser = id => api.delete(`/api/users/${id}`);

/**
 * ==========================
 * Ejemplo de objeto UserShortResponseDTO:
 * {
 *   id: number,
 *   username: string,
 *   fullName: string
 * }
 * 
 * Ejemplo de objeto PersonResponseDTO:
 * {
 *   id: number,
 *   firstName: string,
 *   lastName: string,
 *   dni: string,
 *   gender: "MASCULINO" | "FEMENINO",
 *   address: string,
 *   phone: string,
 *   birthDate: string (ISO-date),
 *   user: {
 *     id: number,
 *     username: string,
 *     email: string,
 *     role: string,
 *     permissions: string[]
 *   }
 * }
 * 
 * Ejemplo de objeto PersonCreateDTO:
 * {
 *   firstName: string,
 *   lastName: string,
 *   dni: string,
 *   gender: "MASCULINO" | "FEMENINO",
 *   address: string,
 *   phone: string,
 *   birthDate: string (YYYY-MM-DD),
 *   user: {
 *     username: string,
 *     email: string,
 *     password: string,
 *     role: string
 *   }
 * }
 * ==========================
 */

