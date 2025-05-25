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
    {
        "id": 1001,
        "product": {
            "id": 42,
            "title": "Java Concurrency in Practice"
        },
        "type": "IN",
        "quantity": 5,
        "movementDate": "2024-05-23T17:32:11",
        "reason": "Ajuste de inventario por daño"
    }
 *
 * InventoryRequestDTO (para recarga/dar baja de stock):
 * {
 *   productId: 1, // integer, requerido
 *   quantity: 10, // integer, requerido
 *   reason: "Reposición por compra" // string, opcional
 * }
 */

// Listar todos los movimientos
export const getStockMovements            = ()         => api.get('/api/stock-movements');
// Obtener movimiento por ID
export const getStockMovementById         = id         => api.get(`/api/stock-movements/${id}`);
// Crear movimiento
export const createStockMovement          = data       => api.post('/api/stock-movements', data);
// Actualizar movimiento
export const updateStockMovement          = (id, data) => api.put(`/api/stock-movements/${id}`, data);
// Por producto
export const getStockMovementsByProduct   = productId  => api.get(`/api/stock-movements/product/${productId}`);

// Recargar stock
export const rechargeStock                = data       => api.post('/api/inventory/recharge', data);
// Dar de baja stock
export const decreaseStock                = data       => api.post('/api/inventory/decrease', data);
// Consultar stock de producto
export const getProductStock              = productId  => api.get(`/api/inventory/product/${productId}/stock`);
