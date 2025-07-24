import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function FormCuentaCobro({
  onSubmit,
  clientes = [],
  onCrearCliente,
  initialData = null,
  onCancel
}) {
  const [showNuevoCliente, setShowNuevoCliente] = useState(false);
  const [clienteRecienCreado, setClienteRecienCreado] = useState(null);

  const [form, setForm] = useState(() => initialData ? {
    ...initialData,
    items: (initialData.items || []).map(it => ({
      ...it,
      fechaItem: it.fechaItem || ""
    }))
  } : {
    clienteNombre: "",
    clienteEmpresa: "",
    clienteNIT: "",
    clienteDireccion: "",
    clienteTelefono: "",
    clienteCiudad: "",
    correo: "",
    items: [{ cantidad: 1, descripcion: "", valorUnitario: "", valorTotal: "", fechaItem: "" }],
    banco: "Bancolombia",
    cuentaBancaria: "230-000443-42",
    subtotal: "",
    total: "",
    fecha: "",
  });

  // Handler universal
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Cambio en un item
  const handleItemChange = (i, field, value) => {
    setForm(f => {
      const items = [...f.items];
      items[i] = { ...items[i], [field]: value };

      // Actualiza total automático si cambia cantidad o unitario
      if (field === "cantidad" || field === "valorUnitario") {
        const cantidad = parseInt(items[i].cantidad) || 0;
        const unitario = parseFloat(items[i].valorUnitario) || 0;
        items[i].valorTotal = cantidad * unitario;
      }
      return { ...f, items };
    });
  };

  const calcularTotales = items => {
    let subtotal = 0;
    items.forEach(it => {
      const total = parseFloat(it.valorTotal) || 0;
      subtotal += total;
    });
    return { subtotal, total: subtotal };
  };

  const agregarItem = () => {
    setForm(f => ({
      ...f,
      items: [...f.items, { cantidad: 1, descripcion: "", valorUnitario: "", valorTotal: "", fechaItem: "" }]
    }));
  };

  const quitarItem = i => {
    setForm(f => ({
      ...f,
      items: f.items.filter((_, idx) => idx !== i)
    }));
  };

  // Selección cliente
  const handleClienteSelect = e => {
    const nombre = e.target.value;
    if (nombre === "__nuevo__") {
      setShowNuevoCliente(true);
      return;
    }
    setForm(f => {
      const cliente = clientes.find(c => c.nombre === nombre);
      if (cliente) {
        return {
          ...f,
          clienteNombre: cliente.nombre,
          clienteEmpresa: cliente.empresa || "",
          clienteNIT: cliente.nit || "",
          clienteDireccion: cliente.direccion || "",
          clienteTelefono: cliente.telefono || "",
          clienteCiudad: cliente.ciudad || "",
          correo: cliente.correo || "",
        };
      } else {
        return { ...f, clienteNombre: nombre };
      }
    });
    setShowNuevoCliente(false);
    setClienteRecienCreado(null);
  };

  // Crear cliente desde el form (flujo premium)
  const handleCrearCliente = (datos) => {
    onCrearCliente(datos);
    setForm(f => ({
      ...f,
      clienteNombre: datos.nombre,
      clienteEmpresa: datos.empresa,
      clienteNIT: datos.nit,
      clienteDireccion: datos.direccion,
      clienteTelefono: datos.telefono,
      clienteCiudad: datos.ciudad,
      correo: datos.correo,
    }));
    setShowNuevoCliente(false);
    setClienteRecienCreado(datos.nombre);
    setTimeout(() => setClienteRecienCreado(null), 2500); // Quita mensaje tras 2.5s
  };

  // On submit
  const handleSubmit = e => {
    e.preventDefault();
    const { subtotal, total } = calcularTotales(form.items);
    onSubmit({
      ...form,
      subtotal,
      total,
      items: form.items,
    });
    setForm({
      clienteNombre: "",
      clienteEmpresa: "",
      clienteNIT: "",
      clienteDireccion: "",
      clienteTelefono: "",
      clienteCiudad: "",
      correo: "",
      items: [{ cantidad: 1, descripcion: "", valorUnitario: "", valorTotal: "", fechaItem: "" }],
      banco: "Bancolombia",
      cuentaBancaria: "230-000443-42",
      subtotal: "",
      total: "",
      fecha: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Selección cliente */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <label className="font-bold text-primary-700 text-xs mb-1 block">Cliente</label>
          <select
            value={form.clienteNombre}
            onChange={handleClienteSelect}
            className="w-full rounded-xl px-3 py-2 border text-base"
            required
          >
            <option value="">Selecciona un cliente...</option>
            {clientes.map(c => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
            <option value="__nuevo__">+ Registrar nuevo cliente</option>
          </select>
        </div>
      </div>

      {/* Formulario cliente nuevo, SIEMPRE visible y responsivo */}
      {showNuevoCliente && (
        <div className="bg-primary-50 p-4 rounded-xl border mt-2 mb-2 shadow">
          <h3 className="font-bold text-primary-700 text-base mb-2">Registrar Cliente</h3>
          <FormClienteResponsive onSubmit={handleCrearCliente} />
        </div>
      )}

      {clienteRecienCreado && (
        <div className="text-green-700 font-bold bg-green-100 p-2 rounded-xl text-center transition-all duration-300">
          ¡Cliente creado y seleccionado!
        </div>
      )}

      {/* Datos del cliente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input label="Empresa" name="clienteEmpresa" value={form.clienteEmpresa} onChange={handleChange} />
        <Input label="NIT" name="clienteNIT" value={form.clienteNIT} onChange={handleChange} />
        <Input label="Ciudad" name="clienteCiudad" value={form.clienteCiudad} onChange={handleChange} />
        <Input label="Dirección" name="clienteDireccion" value={form.clienteDireccion} onChange={handleChange} />
        <Input label="Teléfono" name="clienteTelefono" value={form.clienteTelefono} onChange={handleChange} />
        <Input label="Correo" name="correo" value={form.correo} onChange={handleChange} />
      </div>

      {/* Fecha general de la cuenta de cobro */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            label="Fecha de cuenta"
            name="fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* ITEMS/RECORRIDOS */}
      <div className="mt-2">
        <label className="font-bold text-primary-700 text-xs mb-2 block">Recorridos / Servicios</label>
        <div className="flex flex-col gap-3">
          {form.items.map((item, i) => (
            <div key={i} className="rounded-xl border bg-white shadow p-3 grid grid-cols-1 md:grid-cols-7 gap-2 items-end">
              <Input
                label="Cantidad"
                name="cantidad"
                type="number"
                min="1"
                value={item.cantidad}
                onChange={e => handleItemChange(i, "cantidad", e.target.value)}
                required
              />
              <Input
                label="Descripción"
                name="descripcion"
                value={item.descripcion}
                onChange={e => handleItemChange(i, "descripcion", e.target.value)}
                required
                className="md:col-span-2"
              />
              <Input
                label="Unitario"
                name="valorUnitario"
                type="number"
                min="0"
                value={item.valorUnitario}
                onChange={e => handleItemChange(i, "valorUnitario", e.target.value)}
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
              {/* Fecha de este recorrido/item */}
              <Input
                label="Fecha recorrido"
                name="fechaItem"
                type="date"
                value={item.fechaItem}
                onChange={e => handleItemChange(i, "fechaItem", e.target.value)}
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
          <Button type="button" onClick={onCancel} className="bg-red-500 text-white flex-1">
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

// Formulario cliente responsive
function FormClienteResponsive({ onSubmit }) {
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
    await new Promise((res) => setTimeout(res, 300));
    setLoading(false);
    onSubmit && onSubmit(form);
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
        {loading ? "Guardando..." : "Guardar y usar este cliente"}
      </Button>
    </form>
  );
}
