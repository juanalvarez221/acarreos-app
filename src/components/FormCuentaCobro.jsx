import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

// Función para formatear valores a COP (1.234.567,89)
function formatCOP(value) {
  if (typeof value === "string") {
    value = value.replace(/\./g, '').replace(',', '.');
  }
  let number = parseFloat(value) || 0;
  // Opcional: mostrar decimales solo si el usuario los escribe
  return number.toLocaleString("es-CO", { minimumFractionDigits: 0 });
}

// Quita formateo para parsear valores numéricos
function parseCOP(value) {
  if (typeof value === "number") return value;
  return value.replace(/\./g, '').replace(',', '.');
}

export default function FormCuentaCobro({
  onSubmit,
  clientes = [],
  cuentas = [],
  initialData = null,
  onCancel,
  onCrearCliente
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
            valorUnitario: formatCOP(it.valorUnitario),
            valorTotal: formatCOP(it.valorTotal),
          })),
        }
      : {
          nroCuenta: "",
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

  // Cambia cualquier campo del form principal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Cambia selección de cliente
  const handleClienteSelect = (e) => {
    const id = e.target.value;
    setForm((f) => ({ ...f, clienteId: id }));
    setClienteSeleccionado(id);
    setShowNuevoCliente(false);
  };

  // Cambia items y formatea valores COP mientras escribe
  const handleItemChange = (i, field, value) => {
    setForm((f) => {
      const items = [...f.items];
      if (field === "valorUnitario") {
        // Formatea mientras escribe
        const raw = parseCOP(value.replace(/[^0-9.,]/g, ""));
        items[i][field] = formatCOP(raw);

        // Calcula total
        const cantidad = parseInt(items[i].cantidad) || 0;
        const unitario = parseFloat(parseCOP(items[i].valorUnitario)) || 0;
        items[i].valorTotal = formatCOP(cantidad * unitario);
      } else if (field === "cantidad") {
        const cantidad = parseInt(value) || 0;
        items[i][field] = cantidad;
        const unitario = parseFloat(parseCOP(items[i].valorUnitario)) || 0;
        items[i].valorTotal = formatCOP(cantidad * unitario);
      } else {
        items[i][field] = value;
      }
      return { ...f, items };
    });
  };

  // Agrega un nuevo item vacío
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

  // Quita un item
  const quitarItem = (i) => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, idx) => idx !== i),
    }));
  };

  // Suma totales
  const calcularTotales = (items) => {
    let subtotal = 0;
    items.forEach((it) => {
      const total = parseFloat(parseCOP(it.valorTotal)) || 0;
      subtotal += total;
    });
    return { subtotal, total: subtotal };
  };

  // Cuando se crea un cliente rápido
  const handleClienteCreado = (nuevo) => {
    setClientesLocal((prev) => [...prev, nuevo]);
    setForm((f) => ({ ...f, clienteId: nuevo.id }));
    setClienteSeleccionado(nuevo.id);
    setShowNuevoCliente(false);
    onCrearCliente && onCrearCliente(nuevo);
  };

  // Submit final
  const handleSubmit = (e) => {
    e.preventDefault();
    const { subtotal, total } = calcularTotales(form.items);
    const datosCliente = clientesLocal.find((c) => c.id === form.clienteId);

    let nroCuentaFinal = form.nroCuenta?.trim();

    // Autonumeración por cliente si está vacío
    if (!nroCuentaFinal) {
      const cuentasCliente = cuentas.filter(
        (cta) => cta.clienteId === form.clienteId
      );
      const inicialesCliente =
        (datosCliente?.nombre || "CLI").substring(0, 3).toUpperCase();

      const ultimosNumeros = cuentasCliente
        .map((c) => {
          const match = c.nroCuenta?.match(/(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((n) => !isNaN(n));

      const siguiente = ultimosNumeros.length
        ? Math.max(...ultimosNumeros) + 1
        : 1;

      nroCuentaFinal = `${inicialesCliente}-${String(siguiente).padStart(4, "0")}`;
    }

    onSubmit({
      ...form,
      nroCuenta: nroCuentaFinal,
      subtotal,
      total,
      clienteNombre: datosCliente?.nombre || "",
      clienteEmpresa: datosCliente?.empresa || "",
      clienteNIT: datosCliente?.nit || "",
      clienteDireccion: datosCliente?.direccion || "",
      clienteTelefono: datosCliente?.telefono || "",
      clienteCiudad: datosCliente?.ciudad || "",
      correo: datosCliente?.correo || "",
      items: form.items.map((it) => ({
        ...it,
        valorUnitario: parseCOP(it.valorUnitario),
        valorTotal: parseCOP(it.valorTotal)
      })),
    });

    setForm({
      nroCuenta: "",
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

      {/* Formulario cliente nuevo */}
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

      {/* Vista previa de datos del cliente */}
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

      {/* Número de cuenta */}
      <Input
        label="Número de cuenta de cobro"
        name="nroCuenta"
        value={form.nroCuenta}
        onChange={handleChange}
        lang="es"
        spellCheck="true"
        placeholder="Se autogenera si lo dejas vacío"
      />

      {/* Fecha */}
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
                lang="es"
                spellCheck="true"
              />
              <Input
                label="Unitario"
                name="valorUnitario"
                type="text"
                inputMode="decimal"
                value={item.valorUnitario}
                onChange={(e) =>
                  handleItemChange(i, "valorUnitario", e.target.value)
                }
                required
                placeholder="Ej: 150.000"
              />
              <Input
                label="Total"
                name="valorTotal"
                type="text"
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
          lang="es"
          spellCheck="true"
        />
        <Input
          label="Cuenta Bancaria"
          name="cuentaBancaria"
          value={form.cuentaBancaria}
          onChange={handleChange}
          required
        />
      </div>

      {/* Totales */}
      <div className="flex flex-col md:flex-row gap-3 items-center mt-3">
        <div className="flex-1 font-bold text-primary-700 text-lg">
          Subtotal: ${formatCOP(calcularTotales(form.items).subtotal)}
        </div>
        <div className="flex-1 font-bold text-accent-700 text-lg">
          Total: ${formatCOP(calcularTotales(form.items).total)}
        </div>
      </div>

      {/* Botones */}
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

// Registro rápido de cliente
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
      <Input name="nombre" value={form.nombre} onChange={handleChange} required label="Nombre" lang="es" spellCheck="true" />
      <Input name="empresa" value={form.empresa} onChange={handleChange} required label="Empresa" lang="es" spellCheck="true" />
      <Input name="nit" value={form.nit} onChange={handleChange} required label="NIT" />
      <Input name="direccion" value={form.direccion} onChange={handleChange} required label="Dirección" lang="es" spellCheck="true" />
      <Input name="telefono" value={form.telefono} onChange={handleChange} required label="Teléfono" />
      <Input name="ciudad" value={form.ciudad} onChange={handleChange} required label="Ciudad" lang="es" spellCheck="true" />
      <Input name="correo" value={form.correo} onChange={handleChange} required label="Correo" type="email" />
      <Button type="submit" className="md:col-span-3 mt-2">
        {loading ? "Guardando..." : "Guardar y seleccionar"}
      </Button>
    </form>
  );
}
