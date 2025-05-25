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

// Consultar historial (con filtros de fecha opcionales, formato '2024-05-23T23:59:59')
export const getSales                = (params)      => api.get('/api/sales', { params });
// Obtener venta por ID
export const getSaleById             = id            => api.get(`/api/sales/${id}`);
// Registrar venta
export const createSale              = saleData      => api.post('/api/sales', saleData);
// Ventas por usuario vendedor
export const getSalesByUser          = userId        => api.get(`/api/sales/user/${userId}`);
