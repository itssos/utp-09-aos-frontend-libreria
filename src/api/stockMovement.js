import { api } from './apiHelper';

/**
 * StockMovementCreateDTO (para crear/actualizar movimiento):
 * {
 *   productId: 12, // integer, requerido
 *   type: "IN" | "OUT", // string, requerido ("IN" para entrada, "OUT" para salida)
 *   quantity: 5, // integer, requerido, mínimo 1
 *   reason: "Ajuste de inventario por daño" // string, opcional
 * }
 *
 * StockMovementResponseDTO (respuesta):
 * {
 *   id: 1001,
 *   product: { id, title },
 *   type: "IN",
 *   quantity: 5,
 *   movementDate: "2024-05-23T17:32:11",
 *   reason: "Ajuste de inventario por daño"
 * }
 */

/**
 * Obtiene una página de movimientos de stock filtrados y ordenados.
 * @param {Object} params - Parámetros de consulta (todos opcionales)
 * @param {number} params.productId - ID del producto
 * @param {'IN'|'OUT'} params.movementType - Tipo de movimiento
 * @param {string} params.fromDate - Fecha inicial (formato: yyyy-MM-dd'T'HH:mm:ss)
 * @param {string} params.toDate - Fecha final (formato: yyyy-MM-dd'T'HH:mm:ss)
 * @param {'asc'|'desc'} params.sort - Orden por fecha (default desc)
 * @param {number} params.page - Número de página (default 0)
 * @param {number} params.size - Tamaño de página (default 20)
 * @returns {Promise} Axios promise
 *
 * Ejemplo de uso:
 *   getStockMovements({
 *     productId: 7,
 *     movementType: 'IN',
 *     fromDate: '2024-05-01T00:00:00',
 *     toDate:   '2024-05-25T23:59:59',
 *     sort: 'asc',
 *     page: 0,
 *     size: 50
 *   })
 */
export const getStockMovements = (params) => api.get('/api/stock-movements', { params });

// Obtener movimiento por ID
export const getStockMovementById = id => api.get(`/api/stock-movements/${id}`);

// Crear movimiento
export const createStockMovement = data => api.post('/api/stock-movements', data);

// Actualizar movimiento
export const updateStockMovement = (id, data) => api.put(`/api/stock-movements/${id}`, data);

// Obtener movimientos SOLO de un producto específico (sin filtros extra)
export const getStockMovementsByProduct = productId => api.get(`/api/stock-movements/product/${productId}`);


// Recargar stock
export const rechargeStock                = data       => api.post('/api/inventory/recharge', data);
// Dar de baja stock
export const decreaseStock                = data       => api.post('/api/inventory/decrease', data);
// Consultar stock de producto
export const getProductStock              = productId  => api.get(`/api/inventory/product/${productId}/stock`);
