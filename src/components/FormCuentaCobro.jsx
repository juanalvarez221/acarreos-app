import { useState, useEffect } from "react";
import Input from "./input";
import Button from "./Button";
import { PlusCircle, Trash2, FileText, UserPlus2 } from "lucide-react";

export default function FormCuentaCobro({
  onSubmit,
  clientes = [],
  onCrearCliente,
  initialData = null,
  onCancel,
}) {
  // Edición o nuevo
  const [cliente, setCliente] = useState(initialData ? getClienteObj(initialData, clientes) : null);
  const [busqueda, setBusqueda] = useState("");
  const [showNuevo, setShowNuevo] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    empresa: "",
    nit: "",
    direccion: "",
    telefono: "",
    ciudad: "",
    correo: "",
  });

  const [items, setItems] = useState(
    initialData && initialData.items && initialData.items.length
      ? initialData.items
      : [{ cantidad: 1, descripcion: "", valorUnitario: "", valorTotal: "" }]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCliente(getClienteObj(initialData, clientes));
      setItems(initialData.items);
    }
    // eslint-disable-next-line
  }, [initialData]);

  function getClienteObj(data, clientes) {
    return clientes.find(
      c => c.nombre === data.clienteNombre && c.nit === data.clienteNIT
    ) || {
      nombre: data.clienteNombre,
      empresa: data.clienteEmpresa,
      nit: data.clienteNIT,
      direccion: data.clienteDireccion,
      telefono: data.clienteTelefono,
      ciudad: data.clienteCiudad,
      correo: data.correo,
    };
  }

  const clientesFiltrados = clientes.filter(c =>
    (c.nombre + " " + (c.empresa || ""))
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const handleItemChange = (i, field, value) => {
    const nuevos = [...items];
    nuevos[i][field] = value;
    if (field === "cantidad" || field === "valorUnitario") {
      const cantidad = parseFloat(nuevos[i].cantidad) || 0;
      const valorUnitario = parseFloat(nuevos[i].valorUnitario) || 0;
      nuevos[i].valorTotal = cantidad * valorUnitario || "";
    }
    setItems(nuevos);
  };
  const addItem = () => setItems(i => [...i, { cantidad: 1, descripcion: "", valorUnitario: "", valorTotal: "" }]);
  const removeItem = (idx) => setItems(i => i.length === 1 ? i : i.filter((_, j) => j !== idx));

  const subtotal = items.reduce((acc, it) => acc + (parseFloat(it.valorTotal) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cliente) {
      alert("Selecciona un cliente o crea uno nuevo.");
      return;
    }
    if (!items.length || !items[0].descripcion) {
      alert("Agrega al menos un recorrido.");
      return;
    }
    setLoading(true);
    await new Promise(res => setTimeout(res, 700));
    setLoading(false);
    onSubmit &&
      onSubmit({
        id: initialData && initialData.id ? initialData.id : Date.now(),
        nroCuenta: initialData && initialData.nroCuenta ? initialData.nroCuenta : Date.now().toString().slice(-5),
        fecha: initialData && initialData.fecha ? initialData.fecha : new Date().toISOString().slice(0, 10),
        clienteNombre: cliente.nombre,
        clienteEmpresa: cliente.empresa,
        clienteNIT: cliente.nit,
        clienteDireccion: cliente.direccion,
        clienteTelefono: cliente.telefono,
        clienteCiudad: cliente.ciudad,
        correo: cliente.correo,
        items,
        subtotal,
        total: subtotal,
        banco: cliente.banco || "Bancolombia",
        cuentaBancaria: cliente.cuentaBancaria || "",
        emisorNombre: "ANGEL DARIO ALVAREZ PARRA",
        emisorNIT: "98.636.763",
        emisorDireccion: "CR 50A 73 A 48 APTO 401",
        emisorTelefono: "3103997817",
        regimen: "Simplificado",
        detalleServicio: items.map(it => it.descripcion).join(", "),
        mensajeLegal: "Dando cumplimiento al decreto 2231, artículo 9 manifiesto bajo gravedad de juramento que durante el año 2024 no tomaré costos y gastos asociados a dicha renta. Por lo tanto, aplicar el artículo 383 ET.",
        estado: initialData && initialData.estado ? initialData.estado : "generada",
      });
    if (!initialData) {
      setCliente(null);
      setBusqueda("");
      setItems([{ cantidad: 1, descripcion: "", valorUnitario: "", valorTotal: "" }]);
    }
  };

  const handleCrearCliente = (e) => {
    e.preventDefault();
    if (Object.values(nuevoCliente).some(x => !x.trim())) {
      alert("Completa todos los campos del cliente");
      return;
    }
    onCrearCliente && onCrearCliente(nuevoCliente);
    setCliente(nuevoCliente);
    setNuevoCliente({
      nombre: "",
      empresa: "",
      nit: "",
      direccion: "",
      telefono: "",
      ciudad: "",
      correo: "",
    });
    setShowNuevo(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" autoComplete="off">
      <div>
        <label className="block font-bold text-lg text-primary-700 mb-2">Cliente</label>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none text-lg bg-gray-100 transition"
              placeholder="Buscar cliente por nombre o empresa..."
              value={cliente ? (cliente.nombre + (cliente.empresa ? ` (${cliente.empresa})` : "")) : busqueda}
              onChange={e => {
                setBusqueda(e.target.value);
                setCliente(null);
              }}
              autoComplete="off"
              onFocus={() => setCliente(null)}
            />
            {(!cliente && busqueda) && (
              <div className="absolute z-10 bg-white border rounded-xl mt-1 w-full shadow-xl max-h-48 overflow-auto">
                {clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((c, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-primary-50 cursor-pointer"
                      onClick={() => {
                        setCliente(c);
                        setBusqueda("");
                      }}
                    >
                      {c.nombre} {c.empresa ? `(${c.empresa})` : ""}
                      <div className="text-xs text-gray-400">{c.correo}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400">No encontrado.</div>
                )}
              </div>
            )}
          </div>
          <Button
            type="button"
            icon={UserPlus2}
            className="bg-violet-500 hover:bg-violet-600"
            onClick={() => setShowNuevo(true)}
          >
            Nuevo cliente
          </Button>
        </div>
      </div>
      {cliente && (
        <div className="rounded-xl bg-primary-50 p-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 border border-primary-100">
          <div>
            <div className="font-bold text-primary-700">{cliente.nombre}</div>
            <div className="text-gray-600">{cliente.empresa}</div>
          </div>
          <div className="text-sm text-gray-500">
            <span>NIT: {cliente.nit} <br />
            Dir: {cliente.direccion} <br />
            Tel: {cliente.telefono}</span>
          </div>
          <div className="text-sm text-gray-500">
            Ciudad: {cliente.ciudad} <br />
            Correo: {cliente.correo}
          </div>
        </div>
      )}

      <div className="mt-4 mb-2">
        <label className="block font-bold text-lg text-primary-700 mb-2">
          Recorridos / Viajes
        </label>
        <div className="flex flex-col gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end bg-gray-100 rounded-xl p-3 relative shadow-inner">
              <Input
                label="Cantidad"
                name="cantidad"
                type="number"
                min={1}
                value={item.cantidad}
                onChange={e => handleItemChange(idx, "cantidad", e.target.value)}
                className="md:col-span-1"
              />
              <Input
                label="Descripción del Recorrido"
                name="descripcion"
                value={item.descripcion}
                onChange={e => handleItemChange(idx, "descripcion", e.target.value)}
                placeholder="Ej: Recorrido Medellín → Envigado, 22/07/2025"
                className="md:col-span-2"
              />
              <Input
                label="Valor Unitario"
                name="valorUnitario"
                type="number"
                min={0}
                value={item.valorUnitario}
                onChange={e => handleItemChange(idx, "valorUnitario", e.target.value)}
                className="md:col-span-1"
              />
              <Input
                label="Valor Total"
                name="valorTotal"
                type="number"
                min={0}
                value={item.valorTotal}
                readOnly
                className="md:col-span-1 bg-gray-200"
              />
              {items.length > 1 && (
                <button
                  type="button"
                  title="Eliminar recorrido"
                  onClick={() => removeItem(idx)}
                  className="absolute top-3 right-3 text-red-500 hover:bg-red-100 rounded-full p-1 transition"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 mt-3 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition w-full md:w-auto justify-center"
        >
          <PlusCircle size={20} />
          Agregar recorrido
        </button>
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-end gap-4 md:gap-6">
        <div className="text-xl font-bold text-primary-700">
          Subtotal: <span className="ml-2 text-gray-900">${subtotal.toLocaleString()}</span>
        </div>
        <div className="text-2xl font-extrabold text-accent-500">
          Total: <span className="ml-2">${subtotal.toLocaleString()}</span>
        </div>
      </div>
      <Button
        type="submit"
        icon={FileText}
        disabled={loading}
        className="mt-8 w-full md:w-auto px-12 text-lg"
      >
        {loading ? "Generando..." : initialData ? "Actualizar Cuenta de Cobro" : "Generar Cuenta de Cobro"}
      </Button>
      {onCancel && (
        <Button
          type="button"
          className="mt-2 w-full md:w-auto px-12 text-lg bg-gray-300 hover:bg-gray-400 text-gray-700"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      )}

      {/* Modal para crear cliente */}
      {showNuevo && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <form
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-lg w-full relative"
            onSubmit={handleCrearCliente}
          >
            <button type="button" onClick={() => setShowNuevo(false)} className="absolute top-4 right-4 text-gray-500 hover:text-accent-500 text-2xl">&times;</button>
            <div className="text-xl font-bold mb-4">Nuevo Cliente</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Nombre" name="nombre" value={nuevoCliente.nombre} onChange={e => setNuevoCliente(c => ({ ...c, nombre: e.target.value }))} required />
              <Input label="Empresa" name="empresa" value={nuevoCliente.empresa} onChange={e => setNuevoCliente(c => ({ ...c, empresa: e.target.value }))} required />
              <Input label="NIT" name="nit" value={nuevoCliente.nit} onChange={e => setNuevoCliente(c => ({ ...c, nit: e.target.value }))} required />
              <Input label="Dirección" name="direccion" value={nuevoCliente.direccion} onChange={e => setNuevoCliente(c => ({ ...c, direccion: e.target.value }))} required />
              <Input label="Teléfono" name="telefono" value={nuevoCliente.telefono} onChange={e => setNuevoCliente(c => ({ ...c, telefono: e.target.value }))} required />
              <Input label="Ciudad" name="ciudad" value={nuevoCliente.ciudad} onChange={e => setNuevoCliente(c => ({ ...c, ciudad: e.target.value }))} required />
              <Input label="Correo" name="correo" value={nuevoCliente.correo} onChange={e => setNuevoCliente(c => ({ ...c, correo: e.target.value }))} required />
            </div>
            <Button type="submit" className="mt-5 w-full">Crear Cliente</Button>
          </form>
        </div>
      )}
    </form>
  );
}
