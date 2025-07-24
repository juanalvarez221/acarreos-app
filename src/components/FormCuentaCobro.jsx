import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function FormCuentaCobro({
  onSubmit,
  clientes = [],
  initialData = null,
  onCancel,
  onCrearCliente // Opcional: para refrescar desde app
}) {
  const [showNuevoCliente, setShowNuevoCliente] = useState(false);
  const [clientesLocal, setClientesLocal] = useState(clientes);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(
    initialData ? initialData.clienteId : ""
  );

  const [form, setForm] = useState(() =>
    initialData
      ? {
          ...initialData,
          items: (initialData.items || []).map((it) => ({
            ...it,
            fechaItem: it.fechaItem || "",
          })),
        }
      : {
          clienteId: "",
          fecha: "",
          items: [
            {
              cantidad: 1,
              descripcion: "",
              valorUnitario: "",
              valorTotal: "",
              fechaItem: "",
            },
          ],
          banco: "Bancolombia",
          cuentaBancaria: "230-000443-42",
        }
  );

  // Handler universal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Cliente select
  const handleClienteSelect = (e) => {
    const id = e.target.value;
    setForm((f) => ({ ...f, clienteId: id }));
    setClienteSeleccionado(id);
    setShowNuevoCliente(false);
  };

  // Items
  const handleItemChange = (i, field, value) => {
    setForm((f) => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: value };
      if (field === "cantidad" || field === "valorUnitario") {
        const cantidad = parseInt(items[i].cantidad) || 0;
        const unitario = parseFloat(items[i].valorUnitario) || 0;
        items[i].valorTotal = cantidad * unitario;
      }
      return { ...f, items };
    });
  };

  const agregarItem = () => {
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        {
          cantidad: 1,
          descripcion: "",
          valorUnitario: "",
          valorTotal: "",
          fechaItem: "",
        },
      ],
    }));
  };

  const quitarItem = (i) => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, idx) => idx !== i),
    }));
  };

  const calcularTotales = (items) => {
    let subtotal = 0;
    items.forEach((it) => {
      const total = parseFloat(it.valorTotal) || 0;
      subtotal += total;
    });
    return { subtotal, total: subtotal };
  };

  // Cliente nuevo
  const handleClienteCreado = (nuevo) => {
    setClientesLocal((prev) => [...prev, nuevo]);
    setForm((f) => ({ ...f, clienteId: nuevo.id }));
    setClienteSeleccionado(nuevo.id);
    setShowNuevoCliente(false);
    onCrearCliente && onCrearCliente(nuevo); // Notifica a app si lo necesitas
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const { subtotal, total } = calcularTotales(form.items);
    const datosCliente = clientesLocal.find(
      (c) => c.id === form.clienteId
    );
    onSubmit({
      ...form,
      subtotal,
      total,
      clienteNombre: datosCliente?.nombre || "",
      clienteEmpresa: datosCliente?.empresa || "",
      clienteNIT: datosCliente?.nit || "",
      clienteDireccion: datosCliente?.direccion || "",
      clienteTelefono: datosCliente?.telefono || "",
      clienteCiudad: datosCliente?.ciudad || "",
      correo: datosCliente?.correo || "",
      items: form.items,
    });
    // Reset (opcional)
    setForm({
      clienteId: "",
      fecha: "",
      items: [
        {
          cantidad: 1,
          descripcion: "",
          valorUnitario: "",
          valorTotal: "",
          fechaItem: "",
        },
      ],
      banco: "Bancolombia",
      cuentaBancaria: "230-000443-42",
    });
    setClienteSeleccionado("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Selección cliente */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label className="font-bold text-primary-700 text-xs mb-1 block">
            Cliente
          </label>
          <select
            value={form.clienteId}
            onChange={handleClienteSelect}
            className="w-full rounded-xl px-3 py-2 border text-base"
            required
          >
            <option value="">Selecciona un cliente...</option>
            {clientesLocal.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
            <option value="__nuevo__">+ Registrar nuevo cliente</option>
          </select>
        </div>
      </div>

      {/* Formulario cliente nuevo (solo para registro rápido) */}
      {showNuevoCliente && (
        <div className="bg-primary-50 p-4 rounded-xl border mt-2 mb-2 shadow">
          <h3 className="font-bold text-primary-700 text-base mb-2">
            Registrar Cliente
          </h3>
          <FormClienteQuick
            onClienteCreado={handleClienteCreado}
            setClientes={setClientesLocal}
          />
        </div>
      )}

      {/* Bloque datos cliente solo lectura */}
      {clienteSeleccionado && clienteSeleccionado !== "__nuevo__" && (
        <div className="bg-white rounded-xl shadow p-3 border flex flex-col md:flex-row gap-2 mb-2">
          {(() => {
            const c = clientesLocal.find((c) => c.id === clienteSeleccionado);
            if (!c) return null;
            return (
              <>
                <div className="flex-1">
                  <span className="block text-xs font-bold text-primary-700">
                    Empresa:
                  </span>
                  <span className="block">{c.empresa}</span>
                  <span className="block text-xs font-bold text-primary-700 mt-1">
                    NIT:
                  </span>
                  <span className="block">{c.nit}</span>
                  <span className="block text-xs font-bold text-primary-700 mt-1">
                    Ciudad:
                  </span>
                  <span className="block">{c.ciudad}</span>
                </div>
                <div className="flex-1">
                  <span className="block text-xs font-bold text-primary-700">
                    Dirección:
                  </span>
                  <span className="block">{c.direccion}</span>
                  <span className="block text-xs font-bold text-primary-700 mt-1">
                    Teléfono:
                  </span>
                  <span className="block">{c.telefono}</span>
                  <span className="block text-xs font-bold text-primary-700 mt-1">
                    Correo:
                  </span>
                  <span className="block">{c.correo}</span>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Fecha de la cuenta */}
      <Input
        label="Fecha de generación de cuenta"
        name="fecha"
        type="date"
        value={form.fecha}
        onChange={handleChange}
        required
      />

      {/* Recorridos/items */}
      <div className="mt-2">
        <label className="font-bold text-primary-700 text-xs mb-2 block">
          Recorridos / Servicios
        </label>
        <div className="flex flex-col gap-3">
          {form.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border bg-white shadow p-3 grid grid-cols-1 md:grid-cols-6 gap-2 items-end"
            >
              <Input
                label="Cantidad"
                name="cantidad"
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) =>
                  handleItemChange(i, "cantidad", e.target.value)
                }
                required
              />
              <Input
                label="Descripción"
                name="descripcion"
                value={item.descripcion}
                onChange={(e) =>
                  handleItemChange(i, "descripcion", e.target.value)
                }
                required
                className="md:col-span-2"
              />
              <Input
                label="Unitario"
                name="valorUnitario"
                type="number"
                min="0"
                value={item.valorUnitario}
                onChange={(e) =>
                  handleItemChange(i, "valorUnitario", e.target.value)
                }
                required
              />
              <Input
                label="Total"
                name="valorTotal"
                type="number"
                min="0"
                value={item.valorTotal}
                disabled
              />
              <Input
                label="Fecha recorrido"
                name="fechaItem"
                type="date"
                value={item.fechaItem}
                onChange={(e) =>
                  handleItemChange(i, "fechaItem", e.target.value)
                }
                required
              />
              <button
                type="button"
                className="bg-red-100 text-red-600 rounded-xl font-bold px-3 py-2 text-xs"
                onClick={() => quitarItem(i)}
                disabled={form.items.length === 1}
              >
                Quitar
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-green-500 text-white rounded-xl font-bold px-4 py-2 mt-2"
            onClick={agregarItem}
          >
            + Agregar recorrido
          </button>
        </div>
      </div>

      {/* Banco y cuenta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Banco"
          name="banco"
          value={form.banco}
          onChange={handleChange}
          required
        />
        <Input
          label="Cuenta Bancaria"
          name="cuentaBancaria"
          value={form.cuentaBancaria}
          onChange={handleChange}
          required
        />
      </div>

      {/* Totales automáticos */}
      <div className="flex flex-col md:flex-row gap-3 items-center mt-3">
        <div className="flex-1 font-bold text-primary-700 text-lg">
          Subtotal: ${calcularTotales(form.items).subtotal.toLocaleString()}
        </div>
        <div className="flex-1 font-bold text-accent-700 text-lg">
          Total: ${calcularTotales(form.items).total.toLocaleString()}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 mt-2">
        <Button type="submit" className="flex-1">
          Guardar Cuenta de Cobro
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="bg-red-500 text-white flex-1"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

// Componente para crear cliente rápido, sin mezclar con factura
function FormClienteQuick({ onClienteCreado, setClientes }) {
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    nit: "",
    direccion: "",
    telefono: "",
    ciudad: "",
    correo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    for (const v of Object.values(form)) {
      if (!v.trim()) {
        setLoading(false);
        alert("Por favor llena todos los campos.");
        return;
      }
    }
    const nuevoCliente = { ...form, id: Date.now() };

    let clientesGuardados = [];
    try {
      clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
    } catch {}
    clientesGuardados.push(nuevoCliente);
    localStorage.setItem("clientes", JSON.stringify(clientesGuardados));
    setClientes && setClientes(clientesGuardados);

    setLoading(false);
    onClienteCreado && onClienteCreado(nuevoCliente);

    setForm({
      nombre: "",
      empresa: "",
      nit: "",
      direccion: "",
      telefono: "",
      ciudad: "",
      correo: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Input name="nombre" value={form.nombre} onChange={handleChange} required label="Nombre" />
      <Input name="empresa" value={form.empresa} onChange={handleChange} required label="Empresa" />
      <Input name="nit" value={form.nit} onChange={handleChange} required label="NIT" />
      <Input name="direccion" value={form.direccion} onChange={handleChange} required label="Dirección" />
      <Input name="telefono" value={form.telefono} onChange={handleChange} required label="Teléfono" />
      <Input name="ciudad" value={form.ciudad} onChange={handleChange} required label="Ciudad" />
      <Input name="correo" value={form.correo} onChange={handleChange} required label="Correo" type="email" />
      <Button type="submit" className="md:col-span-3 mt-2">
        {loading ? "Guardando..." : "Guardar y seleccionar"}
      </Button>
    </form>
  );
}
