import { api } from './apiHelper';

/**
 * SaleCreateDTO (para registrar venta):
 * {
 *   userId: 5, // integer, requerido (vendedor)
 *   amountPaid: 200.0, // number, requerido (monto pagado)
 *   items: [ // array, requerido
 *     {
 *       productId: 11, // integer, requerido
 *       quantity: 2 // integer, requerido
 *     }
 *   ]
 * }
 *
 * SaleResponseDTO (respuesta):
    {
        "id": 1001,
        "saleDate": "2024-05-23T16:38:00",
        "totalAmount": 129.8,
        "amountPaid": 130,
        "change": 0.2,
        "user": {
            "id": 5,
            "username": "epalomino",
            "fullName": "Eduardo Palomino"
        },
        "items": [
            {
            "id": 501,
            "product": {
                "id": 42,
                "title": "Java Concurrency in Practice"
            },
            "quantity": 2,
            "unitPrice": 59.9,
            "totalPrice": 119.8
            }
        ]
    }
 */


/**
 * Obtiene el historial de ventas filtrado, paginado y ordenado.
 * 
 * @param {Object} params - Parámetros de consulta (todos son opcionales):
 * @param {number}   [params.userId]     - ID del usuario vendedor.
 * @param {string}   [params.startDate]  - Fecha inicial (formato: 'yyyy-MM-ddTHH:mm:ss').
 * @param {string}   [params.endDate]    - Fecha final (formato: 'yyyy-MM-ddTHH:mm:ss').
 * @param {'asc'|'desc'} [params.sort]   - Orden por fecha de venta ('asc' o 'desc', default: 'desc').
 * @param {number}   [params.page]       - Número de página (inicia en 0, default: 0).
 * @param {number}   [params.size]       - Tamaño de página (default: 20).
 * 
 * Ejemplo de uso:
 *   getSales({
 *     userId: 5,
 *     startDate: '2024-05-01T00:00:00',
 *     endDate:   '2024-05-23T23:59:59',
 *     sort: 'asc',
 *     page: 1,
 *     size: 30
 *   })
 * 
 * Retorna:
 *   Promise con respuesta paginada (puede contener { content, totalPages, ... }).
 */
export const getSales = (params) => api.get('/api/sales', { params });
// Obtener venta por ID
export const getSaleById             = id            => api.get(`/api/sales/${id}`);
// Registrar venta
export const createSale              = saleData      => api.post('/api/sales', saleData);
// Ventas por usuario vendedor
export const getSalesByUser          = userId        => api.get(`/api/sales/user/${userId}`);
