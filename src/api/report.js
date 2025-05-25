import { api } from './apiHelper';

/**
 * getTopSellingProducts params:
 *   limit: número de productos (obligatorio)
 *   startDate: string fecha/hora inicio (opcional)
 *   endDate: string fecha/hora fin (opcional)
 * Devuelve:
    [
        {
            "productId": 1,
            "title": "Biblia Reina Valera",
            "totalSold": 120
        }
    ]
 *
 * getSalesReport params:
 *   limit: número de ventas (obligatorio)
 *   startDate, endDate: string fecha/hora (opcional)
 *   productId: integer (opcional)
 *   userId: integer (opcional)
 * Devuelve:
    [
        {
            "saleId": 2,
            "saleDate": "2025-05-25T09:10:42.891238",
            "username": "admin",
            "productId": 1,
            "productTitle": "Java Concurrency in Practice",
            "quantity": 2,
            "totalPrice": 99.8
        }
    ]
 *
 * getProductsLowStock params:
 *   threshold: integer (opcional, default: 5)
 * Devuelve:
    [
        {
            "productId": 1,
            "title": "Biblia Reina Valera",
            "stock": 3
        }
    ]
 */

// Productos más vendidos
export const getTopSellingProducts   = (params) => api.get('/api/reports/products/top-sold', { params });
// Reporte de ventas filtrado
export const getSalesReport          = (params) => api.get('/api/reports/products/sales', { params });
// Productos con stock bajo
export const getProductsLowStock     = (params) => api.get('/api/reports/products/low-stock', { params });
