import React, { useEffect, useState, useRef } from "react";
import { getProducts } from "../../api/product";
import { createSale, getSales } from "../../api/sale";
// Si tienes getUsers, descomenta esto:
import { getUsers } from "../../api/user";
import { toast } from "react-toastify";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";

function VentaTab({ products }) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [amountPaid, setAmountPaid] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const { user } = useAuth();   

  const filteredProducts = products.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const change = amountPaid ? (parseFloat(amountPaid) - total) : 0;

  const addToCart = prod => {
    setCart(cart => {
      const idx = cart.findIndex(i => i.id === prod.id);
      if (idx > -1) {
        if (cart[idx].quantity < prod.stock)
          return cart.map((item, i) =>
            i === idx ? { ...item, quantity: item.quantity + 1 } : item
          );
        toast.warn("Stock máximo alcanzado");
        return cart;
      } else {
        return [...cart, { ...prod, quantity: 1 }];
      }
    });
    setSearch("");
    inputRef.current?.focus();
  };

  const updateCartQty = (id, qty) => {
    setCart(cart =>
      cart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.stock, qty)) }
          : item
      )
    );
  };

  const removeFromCart = id => {
    setCart(cart => cart.filter(item => item.id !== id));
  };

  const handleSale = async () => {
    if (cart.length === 0) {
      toast.error("No hay productos en la venta");
      return;
    }
    if (!amountPaid || isNaN(amountPaid)) {
      toast.error("Ingrese monto pagado");
      return;
    }
    if (parseFloat(amountPaid) < total) {
      toast.error("Monto pagado insuficiente");
      return;
    }
    setLoading(true);
    try {
      const saleData = {
        userId: user.id,
        amountPaid: parseFloat(amountPaid),
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };
      await createSale(saleData);
      toast.success("Venta registrada");
      setCart([]);
      setAmountPaid("");
      setSearch("");
    } catch (e) {
      toast.error("Error al registrar venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Buscador de producto */}
      <div className="mb-5 flex gap-2">
        <input
          ref={inputRef}
          className="border border-blue-300 rounded-lg px-4 py-2 w-full"
          placeholder="Buscar por nombre o código..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && filteredProducts.length === 1)
              addToCart(filteredProducts[0]);
          }}
        />
      </div>
      <div className="h-64 overflow-y-auto mb-2 rounded border bg-slate-50">
        {search && filteredProducts.length > 0 ? (
          filteredProducts.slice(0, 8).map(prod => (
            <div key={prod.id}
              className="flex items-center justify-between px-3 py-2 border-b hover:bg-blue-100 transition cursor-pointer"
              onClick={() => addToCart(prod)}
            >
              <div>
                <div className="font-semibold text-gray-700">{prod.title}</div>
                <div className="text-xs text-gray-500">{prod.code} — Stock: {prod.stock}</div>
              </div>
              <div className="text-blue-700 font-bold text-lg">s/{prod.price}</div>
              <PlusIcon className="w-5 h-5 text-emerald-600 ml-2" />
            </div>
          ))
        ) : search && filteredProducts.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">Sin resultados</div>
        ) : (
          <div className="px-4 py-12 text-center text-gray-300 select-none">Busque un producto…</div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="font-bold text-gray-700 mb-2">Carrito</h3>
        {cart.length === 0 ? (
          <div className="text-gray-400 text-center py-6">Sin productos</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-blue-700">
                <th>Producto</th>
                <th className="text-center">Cant</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} className="border-b">
                  <td>{item.title}</td>
                  <td className="text-center">
                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      className="w-14 border rounded px-1 py-0.5"
                      onChange={e =>
                        updateCartQty(item.id, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>s/{item.price}</td>
                  <td>s/{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:bg-red-100 rounded p-1"
                      title="Quitar"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Resumen y cobro */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 shadow-inner">
        <table className="w-full text-sm mb-2">
          <tbody>
            <tr>
              <td className="font-semibold text-gray-700">Total a pagar:</td>
              <td className="text-right font-bold text-2xl text-blue-700">
                s/{total.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex items-center gap-2 mb-2">
          <label className="font-semibold">Monto pagado:</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-32"
            placeholder="0.00"
            min={0}
            value={amountPaid}
            onChange={e => setAmountPaid(e.target.value)}
            onFocus={e => e.target.select()}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Vuelto:</span>
          <span className="text-lg font-bold text-emerald-600">
            s/{change >= 0 ? change.toFixed(2) : "0.00"}
          </span>
        </div>
        <button
          className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xl transition shadow-lg disabled:opacity-60"
          disabled={loading || cart.length === 0 || total === 0}
          onClick={handleSale}
        >
          {loading ? "Registrando..." : "Registrar venta"}
        </button>
      </div>
    </div>
  );
}

function HistorialTab() {
  // Puedes traer usuarios del backend o definir aquí
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    userId: "",
    startDate: "",
    endDate: "",
    sort: "desc",
    page: 0,
    size: 20,
  });
  const [sales, setSales] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Puedes cargar usuarios reales con getUsers si lo tienes
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  // Cargar ventas con filtros
  useEffect(() => {
    setLoading(true);
    const params = { ...filters };
    Object.keys(params).forEach(
      k => (params[k] === "" || params[k] == null) && delete params[k]
    );
    getSales(params)
      .then(res => {
        setSales(res.content || []);
        setTotalPages(res.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  // Handlers
  const handleFilter = e => {
    const { name, value } = e.target;
    setFilters(f => ({
      ...f,
      [name]: value,
      page: 0 // reset page al cambiar filtro
    }));
  };
  const clearFilters = () =>
    setFilters({ userId: "", startDate: "", endDate: "", sort: "desc", page: 0, size: 20 });

  const changePage = (newPage) =>
    setFilters(f => ({ ...f, page: newPage }));

  return (
    <div>
      <h3 className="font-bold text-gray-700 mb-4 text-xl">Historial de ventas</h3>
      {/* Filtros */}
      <div className="mb-5 bg-slate-50 rounded-lg shadow p-4 flex flex-wrap gap-4 items-end">
        <select
          name="userId"
          value={filters.userId}
          onChange={handleFilter}
          className="border border-gray-300 rounded-lg px-3 py-2 w-44"
        >
          <option value="">Usuario</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.fullName}</option>
          ))}
        </select>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Desde</label>
          <input
            type="datetime-local"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilter}
            className="border border-gray-300 rounded-lg px-3 py-2 w-48"
            max={filters.endDate || undefined}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Hasta</label>
          <input
            type="datetime-local"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilter}
            className="border border-gray-300 rounded-lg px-3 py-2 w-48"
            min={filters.startDate || undefined}
          />
        </div>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilter}
          className="border border-gray-300 rounded-lg px-3 py-2 w-36"
        >
          <option value="desc">Más recientes</option>
          <option value="asc">Más antiguos</option>
        </select>
        <select
          name="size"
          value={filters.size}
          onChange={handleFilter}
          className="border border-gray-300 rounded-lg px-3 py-2 w-28"
        >
          {[10, 20, 30, 50].map(sz => (
            <option key={sz} value={sz}>{sz} por página</option>
          ))}
        </select>
        <button
          className="ml-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-sm px-3 py-2 rounded-lg border"
          onClick={clearFilters}
          type="button"
        >
          Limpiar filtros
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-2 px-3 text-left">Fecha</th>
              <th className="py-2 px-3 text-left">Usuario</th>
              <th className="py-2 px-3 text-center">Total</th>
              <th className="py-2 px-3 text-center">Pagado</th>
              <th className="py-2 px-3 text-center">Vuelto</th>
              <th className="py-2 px-3 text-left">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  Cargando ventas...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No hay ventas registradas.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="border-t hover:bg-blue-50">
                  <td className="py-2 px-3">{new Date(sale.saleDate).toLocaleString()}</td>
                  <td className="py-2 px-3">{sale.user?.fullName || "—"}</td>
                  <td className="py-2 px-3 text-center text-blue-700 font-bold">s/{sale.totalAmount}</td>
                  <td className="py-2 px-3 text-center">s/{sale.amountPaid}</td>
                  <td className="py-2 px-3 text-center">s/{sale.change}</td>
                  <td className="py-2 px-3">
                    {sale.items.map(item =>
                      <div key={item.id} className="text-xs">
                        {item.product.title} x{item.quantity} <span className="text-gray-400">(s/{item.unitPrice})</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        <button
          className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-gray-700 disabled:opacity-50"
          disabled={filters.page === 0}
          onClick={() => changePage(filters.page - 1)}
        >Anterior</button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded-lg border ${filters.page === idx ? "bg-blue-600 text-white" : "bg-slate-100 text-gray-700"}`}
            onClick={() => changePage(idx)}
          >{idx + 1}</button>
        ))}
        <button
          className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-gray-700 disabled:opacity-50"
          disabled={filters.page === totalPages - 1 || totalPages <= 1}
          onClick={() => changePage(filters.page + 1)}
        >Siguiente</button>
      </div>
    </div>
  );
}

const TABS = [
  { name: "Registrar venta", value: "venta" },
  { name: "Historial", value: "historial" },
];

const CashierPage = () => {
  const [tab, setTab] = useState("venta");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.content || []));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-slate-200">
            {TABS.map(t => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`py-2 px-4 rounded-t-lg font-semibold text-sm transition-all duration-150
                  ${
                    tab === t.value
                      ? "bg-blue-100 border-b-2 border-blue-500 text-blue-700"
                      : "text-gray-500 hover:text-blue-600"
                  }
                `}
              >
                {t.name}
              </button>
            ))}
          </div>
          {/* Tab content */}
          <div>
            {tab === "venta" && <VentaTab products={products} />}
            {tab === "historial" && <HistorialTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierPage;
