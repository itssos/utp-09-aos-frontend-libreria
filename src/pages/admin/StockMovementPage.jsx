import React, { useEffect, useState } from "react";
import {
  getStockMovements,
  createStockMovement,
  updateStockMovement,
  getProductStock,
} from "../../api/stockMovement";
import { getProducts } from "../../api/product";
import Modal from "../../components/UI/Modal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { toast } from "react-toastify";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";

// --- Modal para crear/editar movimiento ---
function StockMovementModal({ trigger, movement, products, onSaved, sizeModal = "md" }) {
  const [data, setData] = useState(
    movement
      ? {
        productId: movement.product.id,
        type: movement.type,
        quantity: movement.quantity,
        reason: movement.reason || "",
      }
      : { productId: "", type: "IN", quantity: 1, reason: "" }
  );
  const [loading, setLoading] = useState(false);

  const [stock, setStock] = useState(null);
  const [stockLoading, setStockLoading] = useState(false);

  useEffect(() => {
    if (movement) {
      setData({
        productId: movement.product.id,
        type: movement.type,
        quantity: movement.quantity,
        reason: movement.reason || "",
      });
    }
  }, [movement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((d) => ({
      ...d,
      [name]: name === "quantity" ? parseInt(value, 10) || "" : value,
    }));
    if (name === "productId") setStock(null);

  };

  const handleConsultarStock = async () => {
    if (!data.productId) return;
    setStockLoading(true);
    try {
      const resp = await getProductStock(data.productId);
      setStock(resp.stock !== undefined ? resp.stock : resp);
    } catch (e) {
      setStock("Error");
    } finally {
      setStockLoading(false);
    }
  };


  const handleSave = async (closeModal) => {
    if (!data.productId) {
      toast.error("Seleccione un producto");
      return;
    }
    if (!data.type) {
      toast.error("Tipo de movimiento requerido");
      return;
    }
    if (!data.quantity || data.quantity < 1) {
      toast.error("Cantidad debe ser mayor o igual a 1");
      return;
    }
    setLoading(true);
    try {
      let saved;
      if (movement && movement.id) {
        saved = await updateStockMovement(movement.id, data);
        toast.success("Movimiento actualizado");
      } else {
        saved = await createStockMovement(data);
        toast.success("Movimiento registrado");
      }
      onSaved?.();
      closeModal?.();
    } catch (e) {
      toast.error("Error al guardar movimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      trigger={trigger}
      title={movement ? "Editar movimiento" : "Nuevo movimiento"}
      size={sizeModal}
      actions={[
        {
          label: movement ? "Actualizar" : "Registrar",
          className: "bg-blue-600 text-white hover:bg-blue-700",
          closeOnClick: false,
          onClick: (closeModal) => handleSave(closeModal),
        },
        {
          label: "Cancelar",
          className: "bg-gray-200 text-gray-700 hover:bg-gray-300",
          closeOnClick: true,
        },
      ]}
    >
      {loading ? (
        <div className="text-center py-6 text-gray-500">Guardando...</div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <label className="font-semibold">Producto *</label>
            <div className="flex gap-2 items-center">
              <select
                name="productId"
                value={data.productId}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
                required
                disabled={!!movement}
              >
                <option value="">Seleccionar...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 text-gray-700 text-sm whitespace-nowrap disabled:opacity-60"
                onClick={handleConsultarStock}
                disabled={!data.productId || stockLoading}
                title="Consultar stock actual"
              >
                {stockLoading ? "Consultando..." : "Consultar stock"}
              </button>
            </div>
            {stock !== null && (
              <div className="text-xs text-gray-700 mt-1">
                Stock actual:{" "}
                <span className={`font-bold ${stock === "Error" ? "text-red-600" : "text-blue-700"}`}>
                  {stock === "Error" ? "No disponible" : stock}
                </span>
              </div>
            )}

          </div>
          <div>
            <label className="font-semibold">Tipo *</label>
            <select
              name="type"
              value={data.type}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              required
            >
              <option value="IN">Entrada (IN)</option>
              <option value="OUT">Salida (OUT)</option>
            </select>
          </div>
          <div>
            <label className="font-semibold">Cantidad *</label>
            <input
              name="quantity"
              type="number"
              min={1}
              value={data.quantity}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              required
            />
          </div>
          <div>
            <label className="font-semibold">Motivo</label>
            <textarea
              name="reason"
              value={data.reason}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              rows={2}
              placeholder="Opcional"
            />
          </div>
        </form>
      )}
    </Modal>
  );
}

// --- Página principal ---
const StockMovementPage = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [reload, setReload] = useState(0);

  const [filters, setFilters] = useState({
    productId: "",
    movementType: "",
    fromDate: "",
    toDate: "",
    sort: "desc",
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); // Puedes cambiar el tamaño de página
  const [totalPages, setTotalPages] = useState(0);
  const [editingMovement, setEditingMovement] = useState(null); // Para el modal de edición rápida

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getStockMovements({
        ...(
          filters.productId ? { productId: filters.productId } : {}
        ),
        ...(
          filters.movementType ? { movementType: filters.movementType } : {}
        ),
        ...(
          filters.fromDate ? { fromDate: filters.fromDate } : {}
        ),
        ...(
          filters.toDate ? { toDate: filters.toDate } : {}
        ),
        sort: filters.sort,
        page,
        size,
      }),
      getProducts()
    ])
      .then(([movs, prods]) => {
        setMovements(movs.content || movs); // Ajusta según tu backend (si es paginado, debe ser movs.content)
        setTotalPages(movs.totalPages ?? 1); // Si el backend no envía, calcula a mano
        setProducts(prods.content || prods);
      })
      .finally(() => setLoading(false));
  }, [filters, page, size, reload]);


  const reloadTable = () => setReload((n) => n + 1);

  const handleDelete = async (mov) => {
    setProcessing(mov.id);
    try {
      // Opcional: podrías implementar deleteStockMovement
      // await deleteStockMovement(mov.id);
      toast.info("Eliminación no implementada");
      // reloadTable();
    } catch (e) {
      toast.error("No se pudo eliminar");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-10 shadow-slate-300 shadow-2xl rounded-4xl">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Movimientos de Stock
          </h1>
          <StockMovementModal
            trigger={
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                <PlusIcon className="w-5 h-5" />
                Nuevo movimiento
              </button>
            }
            products={products}
            onSaved={reloadTable}
          />


        </div>
        <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-xs font-medium">Producto</label>
            <select
              className="block border rounded px-2 py-1 mt-1"
              value={filters.productId}
              onChange={e => setFilters(f => ({ ...f, productId: e.target.value }))}
            >
              <option value="">Todos</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Tipo</label>
            <select
              className="block border rounded px-2 py-1 mt-1"
              value={filters.movementType}
              onChange={e => setFilters(f => ({ ...f, movementType: e.target.value }))}
            >
              <option value="">Todos</option>
              <option value="IN">Entrada</option>
              <option value="OUT">Salida</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Desde</label>
            <input
              type="datetime-local"
              className="block border rounded px-2 py-1 mt-1"
              value={filters.fromDate}
              onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Hasta</label>
            <input
              type="datetime-local"
              className="block border rounded px-2 py-1 mt-1"
              value={filters.toDate}
              onChange={e => setFilters(f => ({ ...f, toDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Orden</label>
            <select
              className="block border rounded px-2 py-1 mt-1"
              value={filters.sort}
              onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
            >
              <option value="desc">Más reciente primero</option>
              <option value="asc">Más antiguo primero</option>
            </select>
          </div>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded ml-2 hover:bg-blue-600"
            onClick={() => { setPage(0); setReload(r => r + 1); }}
          >Buscar</button>
          <button
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded ml-2 hover:bg-gray-300"
            onClick={() => { setFilters({ productId: "", movementType: "", fromDate: "", toDate: "", sort: "desc" }); setPage(0); }}
          >Limpiar</button>
        </div>
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Producto</th>
                <th className="py-3 px-4 text-center">Tipo</th>
                <th className="py-3 px-4 text-center">Cantidad</th>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Motivo</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No hay movimientos para mostrar.
                  </td>
                </tr>
              ) : (
                movements.map((mov) => (
                  <tr key={mov.id} className="border-t hover:bg-slate-50 transition">
                    <td className="py-2 px-4">{mov.id}</td>
                    <td className="py-2 px-4">{mov.product?.title}</td>
                    <td className="py-2 px-4 text-center">
                      {mov.type === "IN" ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 rounded px-2 py-1">
                          <ArrowUpIcon className="w-4 h-4" />
                          Entrada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 rounded px-2 py-1">
                          <ArrowDownIcon className="w-4 h-4" />
                          Salida
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">{mov.quantity}</td>
                    <td className="py-2 px-4">{new Date(mov.movementDate).toLocaleString()}</td>
                    <td className="py-2 px-4">{mov.reason}</td>

                    <td className="py-2 px-4 text-center flex gap-1 justify-center">
                      <StockMovementModal
                        trigger={
                          <button
                            className="text-yellow-600 hover:bg-yellow-100 rounded p-1"
                            title="Editar"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                        }
                        movement={mov}
                        products={products}
                        onSaved={reloadTable}
                      />
                      {/* Puedes agregar aquí el botón de eliminar si quieres */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center px-2 py-3">
            <div>
              Página {page + 1} de {totalPages}
            </div>
            <div className="space-x-1">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700"
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(0, p - 1))}
              >Anterior</button>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              >Siguiente</button>
              <span className="ml-2">
                <select
                  className="border rounded px-2 py-1"
                  value={size}
                  onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
                >
                  {[10, 20, 50, 100].map(n => (
                    <option key={n} value={n}>{n} por página</option>
                  ))}
                </select>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StockMovementPage;
