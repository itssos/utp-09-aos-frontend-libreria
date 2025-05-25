// /components/ProductCard.jsx
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col gap-3 max-w-xs w-full h-full mx-auto">
      <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <img
          src={product.imageUrl || "https://placehold.co/300x400?text=Sin+Imagen"}
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
          style={{ minHeight: 180, maxHeight: 320 }}
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.author?.name}</p>
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded mt-1">
          {product.category?.name}
        </span>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xl font-bold text-emerald-600">${product.price}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}
          >
            {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
          </span>
        </div>
      </div>
      {product.description && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
      )}
    </div>
  );
};

export default ProductCard;
