import { api } from './apiHelper';

/**
 * ProductCreateDTO (para crear/editar):
 * {
 *   title: "Java Concurrency in Practice", // string, requerido
 *   isbn: "978-0134685991", // string, requerido
 *   code: "JAVA-001", // string, requerido
 *   imageUrl: "https://misitio.com/imagenes/java.jpg", // string, opcional
 *   authorId: 3, // integer, requerido
 *   categoryId: 5, // integer, requerido
 *   editorialId: 2, // integer, requerido
 *   price: 49.9, // number, requerido
 *   stock: 10, // integer, requerido
 *   description: "Una guía completa sobre concurrencia en Java.", // string, opcional
 *   publicationDate: "2018-05-10", // string (date), opcional
 *   active: true // boolean, opcional (default: true)
 * }
 *
 * ProductResponseDTO (respuesta):
 * {
        "id": 42,
        "title": "Java Concurrency in Practice",
        "isbn": "978-0134685991",
        "code": "JAVA-001",
        "imageUrl": "https://misitio.com/imagenes/java.jpg",
        "author": {
            "id": 1,
            "name": "Gabriel García Márquez",
            "bio": "Escritor y periodista colombiano, autor de 'Cien años de soledad'.",
            "active": true
        },
        "category": {
            "id": 1,
            "name": "Electrónica",
            "description": "Dispositivos electrónicos y gadgets",
            "active": true
        },
        "editorial": {
            "id": 1,
            "name": "Editorial Planeta",
            "active": true
        },
        "price": 49.9,
        "stock": 10,
        "description": "Una guía completa sobre concurrencia en Java.",
        "publicationDate": "2018-05-10",
        "active": true
    }
 */

/**
 * Parámetros opcionales para filtrar productos:
 * - categoryId   (integer)
 * - editorialId  (integer)
 * - authorId     (integer)
 * - minPrice     (number)
 * - maxPrice     (number)
 * - title        (string, fragmento)
 * - sort         (string: 'asc' o 'desc', default asc)
 * - page         (number)
 * - size         (number)
 * 
 * Ejemplo de uso:
 *   getProducts({ categoryId: 5, minPrice: 30, sort: 'desc' });
 */
/*

getProducts devuelve un ResponseEntity<Page<ProductResponseDTO>>
Ejemplo:
{
  "content": [
    {
      "id": 8,
      "title": "Veinte poemas de amor y una canci¢n desesperada",
      "isbn": "978-8432207077",
      "code": "POE-001",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/81f%2BOeIdzTL.jpg",
      "author": {
        "id": 6,
        "name": "George Orwell",
        "bio": "Escritor ingl‚s, creador de \"1984\" y \"Rebeli¢n en la granja\".",
        "active": true
      },
      "category": {
        "id": 2,
        "name": "Ficci¢n",
        "description": "Libros de ficci¢n, novelas y cuentos",
        "active": true
      },
      "editorial": {
        "id": 7,
        "name": "Editorial SM",
        "active": true
      },
      "price": 29.9,
      "stock": 7,
      "description": "Obra po‚tica fundamental de la literatura chilena.",
      "publicationDate": "1924-01-01",
      "active": true
    },
    {
      "id": 6,
      "title": "Orgullo y prejuicio",
      "isbn": "978-0192833552",
      "code": "NOV-002",
      "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/81zf1A8q1vL.jpg",
      "author": {
        "id": 15,
        "name": "Victor Hugo",
        "bio": "Escritor franc‚s, creador de \"Los miserables\".",
        "active": true
      },
      "category": {
        "id": 2,
        "name": "Ficci¢n",
        "description": "Libros de ficci¢n, novelas y cuentos",
        "active": true
      },
      "editorial": {
        "id": 5,
        "name": "Anagrama",
        "active": true
      },
      "price": 36.9,
      "stock": 9,
      "description": "Cl sico de la literatura inglesa.",
      "publicationDate": "1813-01-28",
      "active": true
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 2,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "last": false,
  "totalElements": 8,
  "totalPages": 4,
  "size": 2,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 2,
  "first": true,
  "empty": false
}

*/

// Listar productos con filtros opcionales
export const getProducts = (params) => api.get('/api/products', { params });
// Listar productos publicos con filtros opcionales
export const getPublicProducts = (params) => api.get('/api/products/public', { params });
// Obtener por ID
export const getProductById    = id            => api.get(`/api/products/${id}`);
// Crear producto
export const createProduct     = productData   => api.post('/api/products', productData);
// Actualizar producto
export const updateProduct     = (id, data)    => api.put(`/api/products/${id}`, data);
// Eliminar producto
export const deleteProduct     = id            => api.delete(`/api/products/${id}`);
// Actualizar solo el estado activo del producto
export const updateProductActive = (id, active)  => api.patch(`/api/products/${id}/active`, null, { params: { active } });