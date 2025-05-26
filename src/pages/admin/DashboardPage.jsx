import React, { useEffect, useState, useRef } from "react";
import {
  getTopSellingProducts,
  getSalesReport,
  getProductsLowStock
} from "../../api/report";

import { jsPDF } from "jspdf";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';


// Para fecha default (últimos 30 días)
function formatDate(dt) {
  return dt.toISOString().slice(0, 16);
}
function date30DaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return formatDate(d);
}

// Helpers para escribir tablas manualmente
function writeTable(doc, columns, rows, startX, startY, rowHeight = 20, colWidths = []) {
  let x = startX;
  let y = startY;

  // Header
  doc.setFont(undefined, "bold");
  columns.forEach((col, i) => {
    doc.text(String(col), x, y);
    x += colWidths[i] || 100;
  });

  // Line under header
  doc.setLineWidth(0.5);
  doc.line(startX, y + 4, x, y + 4);

  // Rows
  doc.setFont(undefined, "normal");
  y += rowHeight;
  rows.forEach(row => {
    x = startX;
    row.forEach((cell, i) => {
      doc.text(String(cell), x, y);
      x += colWidths[i] || 100;
    });
    y += rowHeight;
  });

  return y;
}

const exportPDF = ({
  topProducts = [],
  lowStock = [],
  sales = [],
  topStart,
  topEnd,
  stockThreshold,
  salesLimit,
}) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4"
  });

  const marginLeft = 40;
  let y = 50;

  // Título
  doc.setFontSize(22);
  doc.setTextColor("#2563eb");
  doc.text("Reporte de Dashboard", marginLeft, y);

  y += 28;
  doc.setFontSize(12);
  doc.setTextColor("#1e293b");
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, marginLeft, y);

  // Top productos
  y += 34;
  doc.setFontSize(16);
  doc.setTextColor("#0ea5e9");
  doc.text("Productos más vendidos", marginLeft, y);

  y += 18;
  doc.setFontSize(11);
  doc.setTextColor("#334155");
  doc.text(`Rango: ${topStart} a ${topEnd}   |   Top ${topProducts.length}`, marginLeft, y);

  y += 18;
  if (topProducts.length > 0) {
    y = writeTable(
      doc,
      ["Producto", "Unidades vendidas"],
      topProducts.map(p => [p.title, p.totalSold]),
      marginLeft,
      y,
      20,
      [260, 120]
    ) + 24;
  } else {
    doc.setTextColor("#9ca3af");
    doc.text("No hay datos", marginLeft, y);
    y += 32;
  }

  // Stock bajo
  doc.setFontSize(16);
  doc.setTextColor("#dc2626");
  doc.text("Productos con stock bajo", marginLeft, y);

  y += 18;
  doc.setFontSize(11);
  doc.setTextColor("#334155");
  doc.text(`Umbral: ${stockThreshold} unidades`, marginLeft, y);

  y += 18;
  if (lowStock.length > 0) {
    y = writeTable(
      doc,
      ["Producto", "Stock actual"],
      lowStock.map(p => [p.title, p.stock]),
      marginLeft,
      y,
      20,
      [260, 120]
    ) + 24;
  } else {
    doc.setTextColor("#9ca3af");
    doc.text("Todos los productos están por encima del umbral.", marginLeft, y);
    y += 32;
  }

  // Ventas recientes
  doc.setFontSize(16);
  doc.setTextColor("#0ea5e9");
  doc.text("Ventas recientes", marginLeft, y);

  y += 18;
  doc.setFontSize(11);
  doc.setTextColor("#334155");
  doc.text(`Mostrando las últimas ${salesLimit} ventas`, marginLeft, y);

  y += 18;
  if (sales.length > 0) {
    y = writeTable(
      doc,
      ["Fecha", "Usuario", "Producto", "Cantidad", "Total"],
      sales.map(s => [
        new Date(s.saleDate).toLocaleString(),
        s.username,
        s.productTitle,
        s.quantity,
        "S/ " + Number(s.totalPrice).toFixed(2)
      ]),
      marginLeft,
      y,
      20,
      [120, 120, 180, 80, 80]
    ) + 24;
  } else {
    doc.setTextColor("#9ca3af");
    doc.text("Sin ventas recientes.", marginLeft, y);
    y += 32;
  }

  doc.save("dashboard_reporte.pdf");
};

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
    <div className="min-h-screen bg-slate-50 py-10 px-3" >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
          Dashboard
        </h1>

        <button
          onClick={() =>
            exportPDF({
              topProducts,
              lowStock,
              sales,
              topStart,
              topEnd,
              stockThreshold,
              salesLimit,
            })
          }
          className="fixed top-5 right-5 bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Exportar a PDF (manual)
        </button>


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
              <>
                {/* Gráfico de barras encima de la tabla */}
                <div className="w-full h-64 mb-6">
                  <ResponsiveContainer>
                    <BarChart
                      data={topProducts}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalSold" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* TABLA ORIGINAL */}
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
              </>
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
              <>
                {/* Gráfico de pastel encima de la lista */}
                <div className="w-full h-52 mb-4">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={uniqueLowStock}
                        dataKey="stock"
                        nameKey="title"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#f43f5e"
                        label={({ name }) => name}
                      >
                        {uniqueLowStock.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill='#f43f5e' />
                        ))}
                      </Pie>
                      <Tooltip />
                      {/* <Legend /> */}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* LISTA ORIGINAL */}
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
              </>
            )}
          </div>
        </div>

        {/* Ventas recientes - igual que antes */}
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
