import React, { useEffect, useState } from "react";
import {
  getTopSellingProducts,
  getSalesReport,
  getProductsLowStock
} from "../../api/report";

// Para fecha default (últimos 30 días)
function formatDate(dt) {
  return dt.toISOString().slice(0, 16);
}
function date30DaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return formatDate(d);
}

const DashboardPage = () => {
  // Top productos
  const [topLimit, setTopLimit] = useState(5);
  const [topStart, setTopStart] = useState(date30DaysAgo());
  const [topEnd, setTopEnd] = useState(formatDate(new Date()));
  const [topProducts, setTopProducts] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);

  // Ventas recientes
  const [salesLimit, setSalesLimit] = useState(10);
  const [sales, setSales] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);

  // Stock bajo
  const [lowStock, setLowStock] = useState([]);
  const [stockThreshold, setStockThreshold] = useState(5);
  const [loadingStock, setLoadingStock] = useState(false);

  // Fetch Top Selling Products
  useEffect(() => {
    setLoadingTop(true);
    getTopSellingProducts({
      limit: topLimit,
      startDate: topStart ? new Date(topStart).toISOString() : undefined,
      endDate: topEnd ? new Date(topEnd).toISOString() : undefined,
    })
      .then(setTopProducts)
      .finally(() => setLoadingTop(false));
  }, [topLimit, topStart, topEnd]);

  // Fetch Sales Report
  useEffect(() => {
    setLoadingSales(true);
    getSalesReport({ limit: salesLimit })
      .then(setSales)
      .finally(() => setLoadingSales(false));
  }, [salesLimit]);

  // Fetch Low Stock
  useEffect(() => {
    setLoadingStock(true);
    getProductsLowStock({ threshold: stockThreshold })
      .then(setLowStock)
      .finally(() => setLoadingStock(false));
  }, [stockThreshold]);

  // Filtra productos duplicados por productId (previo al map)
  const uniqueLowStock = Array.isArray(lowStock)
    ? lowStock.filter(
      (item, idx, arr) =>
        arr.findIndex(p => p.productId === item.productId) === idx
    )
    : [];

  const uniqueSales = Array.isArray(sales)
    ? sales.filter((item, idx, arr) =>
      arr.findIndex(s => s.saleId === item.saleId) === idx
    )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-3">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top productos */}
          <div className="col-span-2 bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 gap-4">
              <div>
                <h2 className="text-xl font-bold text-blue-800">Productos más vendidos</h2>
                <p className="text-gray-400 text-sm">
                  En el rango de fechas seleccionado.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="datetime-local"
                  value={topStart}
                  onChange={e => setTopStart(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  max={topEnd}
                  title="Desde"
                />
                <input
                  type="datetime-local"
                  value={topEnd}
                  onChange={e => setTopEnd(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  min={topStart}
                  title="Hasta"
                />
                <select
                  value={topLimit}
                  onChange={e => setTopLimit(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[5, 10, 20, 30].map(n => (
                    <option key={n} value={n}>Top {n}</option>
                  ))}
                </select>
              </div>
            </div>
            {loadingTop ? (
              <div className="text-center text-gray-400 py-8">Cargando...</div>
            ) : topProducts.length === 0 ? (
              <div className="text-center text-gray-300 py-8">Sin datos</div>
            ) : (
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr className="text-left text-blue-600">
                    <th className="py-2">Producto</th>
                    <th className="py-2 text-center">Unidades vendidas</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map(p => (
                    <tr key={p.productId} className="border-t hover:bg-blue-50">
                      <td className="py-2 font-medium">{p.title}</td>
                      <td className="py-2 text-center text-lg text-emerald-700 font-bold">
                        {p.totalSold}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Stock bajo */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-xl font-bold text-rose-700">Stock Bajo</h2>
                <p className="text-gray-400 text-sm">Umbral configurable</p>
              </div>
              <input
                type="number"
                min={1}
                value={stockThreshold}
                onChange={e => setStockThreshold(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm w-20"
                title="Umbral"
              />
            </div>
            {loadingStock ? (
              <div className="text-center text-gray-400 py-8">Cargando...</div>
            ) : lowStock.length === 0 ? (
              <div className="text-center text-gray-300 py-8">No hay productos bajos en stock</div>
            ) : (
              <ul className="divide-y">
                {lowStock.map(p => (
                  <li key={p.productId} className="py-2 flex justify-between items-center">
                    <span className="font-medium">{p.title}</span>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                      {p.stock} unidades
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Ventas recientes */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold text-blue-800">Ventas recientes</h2>
              <p className="text-gray-400 text-sm">
                Últimas ventas registradas ({salesLimit} máximo)
              </p>
            </div>
            <select
              value={salesLimit}
              onChange={e => setSalesLimit(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[10, 20, 30, 50].map(n => (
                <option key={n} value={n}>{n} registros</option>
              ))}
            </select>
          </div>
          {loadingSales ? (
            <div className="text-center text-gray-400 py-8">Cargando...</div>
          ) : sales.length === 0 ? (
            <div className="text-center text-gray-300 py-8">Sin ventas recientes</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-blue-600">
                    <th className="py-2 px-2 text-left">Fecha</th>
                    <th className="py-2 px-2 text-left">Usuario</th>
                    <th className="py-2 px-2 text-left">Producto</th>
                    <th className="py-2 px-2 text-center">Cantidad</th>
                    <th className="py-2 px-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(s => (
                    <tr key={s.saleId} className="border-t hover:bg-blue-50">
                      <td className="py-2 px-2">{new Date(s.saleDate).toLocaleString()}</td>
                      <td className="py-2 px-2">{s.username}</td>
                      <td className="py-2 px-2">{s.productTitle}</td>
                      <td className="py-2 px-2 text-center">{s.quantity}</td>
                      <td className="py-2 px-2 text-right font-bold text-blue-700">${s.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
