import { useState } from "react";
import ResponsiveSidebar from "./components/ResponsiveSidebar";
import PageContainer from "./components/PageContainer";
import SectionTitle from "./components/SectionTitle";
import Card from "./components/Card";
import Button from "./components/Button";
import EmptyState from "./components/EmptyState";
import FormCuentaCobro from "./components/FormCuentaCobro";
import Toaster from "./components/Toaster";
import usePersistedState from "./hooks/usePersistedState";
import Modal from "./components/Modal";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import CuentaCobroPDF from "./components/CuentaCobroPDF";
import dayjs from "dayjs";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell,
} from "recharts";

export default function App() {
  const [section, setSection] = useState("cuentas");
  const [clientes, setClientes] = usePersistedState("clientes", []);
  const [cuentas, setCuentas] = usePersistedState("cuentas", []);
  const [toast, setToast] = useState(false);
  const [cuentaEditar, setCuentaEditar] = useState(null);

  const agregarCuenta = (data) => {
    setCuentas((prev) => [
      ...prev,
      { ...data, id: Date.now(), estado: "generada" }
    ]);
    setToast("¡Cuenta de cobro creada exitosamente!");
  };

  const actualizarCuenta = (cuentaEditada) => {
    setCuentas(prev =>
      prev.map(cta => cta.id === cuentaEditada.id ? { ...cuentaEditada } : cta)
    );
    setCuentaEditar(null);
    setToast("¡Cuenta de cobro actualizada!");
  };

  const eliminarCuenta = (id) => {
    setCuentas((prev) => prev.filter((cta) => cta.id !== id));
    setToast("Cuenta eliminada.");
  };

  const agregarCliente = (data) => {
    setClientes((prev) => [...prev, { ...data, id: Date.now() }]);
    setToast("¡Cliente registrado exitosamente!");
  };

  const eliminarCliente = (id) => {
    setClientes((prev) => prev.filter((cli) => cli.id !== id));
    setToast("Cliente eliminado.");
  };

  const marcarGenerada = (id) => {
    setCuentas(prev =>
      prev.map(cta =>
        cta.id === id
          ? { ...cta, estado: "generada" }
          : cta
      )
    );
  };

  const marcarPendiente = (id) => {
    setCuentas(prev =>
      prev.map(cta =>
        cta.id === id && cta.estado !== "pagada"
          ? { ...cta, estado: "pendiente" }
          : cta
      )
    );
  };

  const marcarPagada = (id) => {
    setCuentas(prev =>
      prev.map(cta =>
        cta.id === id
          ? { ...cta, estado: "pagada" }
          : cta
      )
    );
    setToast("¡Cuenta marcada como pagada!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-primary-50 to-primary-100">
      <ResponsiveSidebar section={section} setSection={setSection} />
      <main className="flex-1 p-2 md:p-8 flex flex-col gap-4 md:gap-6 min-h-screen bg-transparent w-full">
        <PageContainer>
          {section === "cuentas" && (
            <Cuentas
              cuentas={cuentas}
              clientes={clientes}
              onDelete={eliminarCuenta}
              setCuentaEditar={setCuentaEditar}
              agregarCliente={agregarCliente}
              actualizarCuenta={actualizarCuenta}
              marcarPendiente={marcarPendiente}
              marcarPagada={marcarPagada}
              marcarGenerada={marcarGenerada}
            />
          )}
          {section === "nueva" && (
            <NuevaCuenta
              onAdd={agregarCuenta}
              clientes={clientes}
              cuentas={cuentas}
              onCrearCliente={agregarCliente}
            />
          )}
          {section === "clientes" && (
            <Clientes clientes={clientes} onAdd={agregarCliente} onDelete={eliminarCliente} />
          )}
          {section === "estadisticas" && (
            <Estadisticas cuentas={cuentas} clientes={clientes} />
          )}
        </PageContainer>
        <Toaster
          message={toast}
          type="success"
          show={!!toast}
          onClose={() => setToast(false)}
        />
      </main>
      {/* MODAL EDICIÓN */}
      <Modal
        open={!!cuentaEditar}
        onClose={() => setCuentaEditar(null)}
        title="Editar Cuenta de Cobro"
      >
        <FormCuentaCobro
          initialData={cuentaEditar}
          clientes={clientes}
          cuentas={cuentas}
          onCrearCliente={agregarCliente}
          onSubmit={actualizarCuenta}
          onCancel={() => setCuentaEditar(null)}
        />
      </Modal>
    </div>
  );
}

// ------------------- COMPONENTES DE SECCIÓN ----------------------

function Cuentas({ cuentas, clientes, onDelete, setCuentaEditar, marcarPendiente, marcarPagada, marcarGenerada, actualizarCuenta }) {
  const generadas = cuentas.filter(c => c.estado === "generada");
  const pendientes = cuentas.filter(c => c.estado === "pendiente");
  const pagadas = cuentas.filter(c => c.estado === "pagada");

  const dineroPendiente = pendientes.reduce((acc, c) => acc + (parseFloat(c.total) || 0), 0);
  const dineroCobrado = pagadas.reduce((acc, c) => acc + (parseFloat(c.total) || 0), 0);
  const totalGenerado = cuentas.reduce((acc, c) => acc + (parseFloat(c.total) || 0), 0);

  return (
    <div className="max-w-2xl md:max-w-4xl mx-auto">
      <SectionTitle>Cuentas de Cobro</SectionTitle>
      <ResumenCuentas
        generadas={generadas.length}
        pendientes={pendientes.length}
        pagadas={pagadas.length}
        dineroPendiente={dineroPendiente}
        dineroCobrado={dineroCobrado}
        totalGenerado={totalGenerado}
      />
      {cuentas.length === 0 ? (
        <Card className="w-full max-w-full">
          <EmptyState
            title="Aún no tienes cuentas de cobro"
            description="Genera tu primera cuenta para visualizarla aquí."
          />
        </Card>
      ) : (
        <ListadoCuentas
          cuentas={cuentas}
          clientes={clientes}
          onDelete={onDelete}
          setCuentaEditar={setCuentaEditar}
          marcarPendiente={marcarPendiente}
          marcarPagada={marcarPagada}
          marcarGenerada={marcarGenerada}
          actualizarCuenta={actualizarCuenta}
        />
      )}
    </div>
  );
}

function ResumenCuentas({ generadas, pendientes, pagadas, dineroPendiente, dineroCobrado, totalGenerado }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      <div className="bg-blue-100 px-4 py-4 rounded-2xl shadow text-center flex flex-col">
        <span className="text-2xl font-bold text-blue-700">{generadas}</span>
        <span className="text-blue-900 font-medium text-xs">Por enviar</span>
      </div>
      <div className="bg-yellow-100 px-4 py-4 rounded-2xl shadow text-center flex flex-col">
        <span className="text-2xl font-bold text-yellow-600">{pendientes}</span>
        <span className="text-yellow-900 font-medium text-xs">Pendientes de pago</span>
        <span className="text-xs text-yellow-700 mt-1">$
          {dineroPendiente.toLocaleString()}
        </span>
      </div>
      <div className="bg-green-100 px-4 py-4 rounded-2xl shadow text-center flex flex-col col-span-2 md:col-span-1">
        <span className="text-2xl font-bold text-green-700">{pagadas}</span>
        <span className="text-green-900 font-medium text-xs">Pagadas</span>
        <span className="text-xs text-green-700 mt-1">$
          {dineroCobrado.toLocaleString()}
        </span>
      </div>
      <div className="bg-gray-50 border mt-3 px-4 py-2 rounded-2xl shadow text-center col-span-2">
        <span className="text-lg font-bold text-primary-700">Total generado: ${totalGenerado.toLocaleString()}</span>
      </div>
    </div>
  );
}

function NuevaCuenta({ onAdd, clientes, cuentas, onCrearCliente }) {
  return (
    <div className="max-w-2xl md:max-w-3xl mx-auto">
      <SectionTitle>Nueva Cuenta de Cobro</SectionTitle>
      <Card className="w-full max-w-full">
        <FormCuentaCobro
          onSubmit={onAdd}
          clientes={clientes}
          cuentas={cuentas}
          onCrearCliente={onCrearCliente}
        />
      </Card>
    </div>
  );
}

function Clientes({ clientes, onAdd, onDelete }) {
  return (
    <div className="max-w-2xl md:max-w-4xl mx-auto">
      <SectionTitle>Administrar Clientes</SectionTitle>
      <Card className="w-full max-w-full">
        <FormCliente onSubmit={onAdd} />
        <div className="mt-6">
          <ListadoClientes clientes={clientes} onDelete={onDelete} />
        </div>
      </Card>
    </div>
  );
}

function Estadisticas({ cuentas, clientes }) {
  return (
    <div className="max-w-2xl md:max-w-4xl mx-auto">
      <SectionTitle>Estadísticas Financieras</SectionTitle>
      <Card className="w-full max-w-full">
        <EstadisticasFinancieras cuentas={cuentas} clientes={clientes} />
      </Card>
    </div>
  );
}

// ------------------ COMPONENTES AUXILIARES ----------------------

function ListadoCuentas({
  cuentas, clientes, onDelete, setCuentaEditar,
  marcarPendiente, marcarPagada, marcarGenerada, actualizarCuenta
}) {
  const [cuentaVer, setCuentaVer] = useState(null);
  const [filtros, setFiltros] = useState({
    cliente: "",
    estado: "",
    desde: "",
    hasta: "",
  });

  const cuentasFiltradas = cuentas.filter((cta) => {
    if (filtros.cliente && cta.clienteNombre !== filtros.cliente) return false;
    if (filtros.estado && cta.estado !== filtros.estado) return false;
    if (filtros.desde && dayjs(cta.fecha).isBefore(filtros.desde)) return false;
    if (filtros.hasta && dayjs(cta.fecha).isAfter(filtros.hasta)) return false;
    return true;
  });

  const limpiarFiltros = () =>
    setFiltros({ cliente: "", estado: "", desde: "", hasta: "" });

  const handleDescargarPDF = (cuenta) => {
    if (cuenta.estado === "generada") {
      marcarPendiente(cuenta.id);
    }
  };

  return (
    <>
      {/* FILTRO SUPERIOR */}
      <div className="flex flex-col md:flex-row gap-3 mb-4 bg-white/70 p-3 rounded-2xl shadow">
        <div className="flex-1">
          <label className="text-xs font-bold text-primary-700 block mb-1">Cliente</label>
          <select
            value={filtros.cliente}
            onChange={e => setFiltros(f => ({ ...f, cliente: e.target.value }))}
            className="w-full rounded-xl px-3 py-2 border text-sm"
          >
            <option value="">Todos</option>
            {[...new Set(clientes.map(c => c.nombre))]
              .sort()
              .map(nombre => (
                <option key={nombre} value={nombre}>{nombre}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-primary-700 block mb-1">Estado</label>
          <select
            value={filtros.estado}
            onChange={e => setFiltros(f => ({ ...f, estado: e.target.value }))}
            className="w-full rounded-xl px-3 py-2 border text-sm"
          >
            <option value="">Todos</option>
            <option value="generada">Por enviar</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-primary-700 block mb-1">Desde</label>
          <input
            type="date"
            value={filtros.desde}
            onChange={e => setFiltros(f => ({ ...f, desde: e.target.value }))}
            className="rounded-xl px-3 py-2 border text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-primary-700 block mb-1">Hasta</label>
          <input
            type="date"
            value={filtros.hasta}
            onChange={e => setFiltros(f => ({ ...f, hasta: e.target.value }))}
            className="rounded-xl px-3 py-2 border text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={limpiarFiltros}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-primary-700 rounded-xl font-semibold text-xs"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      {/* TABLA */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-primary-50 text-xs">
              <th className="py-2 px-2 md:px-4 font-bold">Estado</th>
              <th className="py-2 px-2 md:px-4 font-bold">N°</th>
              <th className="py-2 px-2 md:px-4 font-bold">Cliente</th>
              <th className="py-2 px-2 md:px-4 font-bold">Fecha</th>
              <th className="py-2 px-2 md:px-4 font-bold">Total</th>
              <th className="py-2 px-2 md:px-4"></th>
            </tr>
          </thead>
          <tbody>
            {cuentasFiltradas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400 font-bold text-lg">
                  No hay cuentas de cobro que coincidan con los filtros.
                </td>
              </tr>
            )}
            {cuentasFiltradas.map((cta) => (
              <tr key={cta.id} className="border-b last:border-0">
                <td className="py-2 px-2 md:px-4 w-[110px]">
                  {cta.estado === "generada" && (
                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs py-2 px-2 rounded-xl"
                      onClick={() => marcarPendiente(cta.id)}
                    >
                      Marcar como enviada
                    </Button>
                  )}
                  {cta.estado === "pendiente" && (
                    <Button
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xs py-2 px-2 rounded-xl"
                      onClick={() => marcarPagada(cta.id)}
                    >
                      Marcar como pagada
                    </Button>
                  )}
                  {cta.estado === "pagada" && (
                    <span className="w-full block bg-green-500 text-white text-xs font-bold rounded-xl py-2 px-2 text-center">
                      Pagada
                    </span>
                  )}
                </td>
                <td className="py-2 px-2 md:px-4">{cta.nroCuenta}</td>
                <td className="py-2 px-2 md:px-4">{cta.clienteNombre}</td>
                <td className="py-2 px-2 md:px-4">{cta.fecha}</td>
                <td className="py-2 px-2 md:px-4 font-semibold text-primary-700">
                  ${parseFloat(cta.total).toLocaleString()}
                </td>
                <td className="py-2 px-2 md:px-4 flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <Button
                    className="px-3 py-2 text-base w-full md:w-auto"
                    onClick={() => setCuentaVer(cta)}
                  >
                    Ver PDF
                  </Button>
                  <Button
                    className="px-3 py-2 text-base bg-blue-500 hover:bg-blue-600 w-full md:w-auto"
                    onClick={() => setCuentaEditar(cta)}
                  >
                    Editar
                  </Button>
                  <Button
                    className="px-3 py-2 text-base bg-red-500 hover:bg-red-600 w-full md:w-auto"
                    onClick={() => onDelete(cta.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={!!cuentaVer}
        onClose={() => setCuentaVer(null)}
        title="Vista previa de cuenta de cobro"
      >
        {window.innerWidth >= 768 ? (
          <div className="h-[70vh] w-full max-w-3xl mx-auto rounded-xl overflow-hidden bg-gray-100 shadow-lg">
            {cuentaVer && (
              <PDFViewer style={{ width: "100%", height: "100%" }}>
                <CuentaCobroPDF data={cuentaVer} />
              </PDFViewer>
            )}
          </div>
        ) : (
          <div className="mb-2 text-center text-gray-500">
            Vista previa no disponible en móviles. Descarga el PDF.
          </div>
        )}
        <div className="mt-4 flex justify-center">
          {cuentaVer && (
            <PDFDownloadLink
              document={<CuentaCobroPDF data={cuentaVer} />}
              fileName={`cuenta-cobro-${cuentaVer.nroCuenta}.pdf`}
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white rounded-xl font-bold shadow-xl hover:bg-accent-600 transition"
              onClick={() => handleDescargarPDF(cuentaVer)}
            >
              Descargar PDF
            </PDFDownloadLink>
          )}
        </div>
      </Modal>
    </>
  );
}

function FormCliente({ onSubmit }) {
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
    await new Promise((res) => setTimeout(res, 500));
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombre" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none text-lg bg-gray-100 transition" lang="es" spellCheck="true" />
      <input name="empresa" value={form.empresa} onChange={handleChange} required placeholder="Empresa" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none text-lg bg-gray-100 transition" lang="es" spellCheck="true" />
      <input name="nit" value={form.nit} onChange={handleChange} required placeholder="NIT" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none text-lg bg-gray-100 transition" />
      <input name="direccion" value={form.direccion} onChange={handleChange} required placeholder="Dirección" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none text-lg bg-gray-100 transition" lang="es" spellCheck="true" />
      <input name="telefono" value={form.telefono} onChange={handleChange} required placeholder="Teléfono" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none text-lg bg-gray-100 transition" />
      <input name="ciudad" value={form.ciudad} onChange={handleChange} required placeholder="Ciudad" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none text-lg bg-gray-100 transition" lang="es" spellCheck="true" />
      <input name="correo" value={form.correo} onChange={handleChange} required placeholder="Correo" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none text-lg bg-gray-100 transition" />
      <Button type="submit" className="md:col-span-3 mt-2">
        {loading ? "Guardando..." : "Agregar Cliente"}
      </Button>
    </form>
  );
}

function ListadoClientes({ clientes, onDelete }) {
  if (!clientes.length)
    return <div className="text-center text-gray-400 mt-4">No hay clientes registrados.</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-left">
        <thead>
          <tr className="bg-primary-50">
            <th className="py-2 px-3 font-bold">Nombre</th>
            <th className="py-2 px-3 font-bold">Empresa</th>
            <th className="py-2 px-3 font-bold">NIT</th>
            <th className="py-2 px-3 font-bold">Ciudad</th>
            <th className="py-2 px-3 font-bold">Correo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cli) => (
            <tr key={cli.id} className="border-b last:border-0">
              <td className="py-2 px-3">{cli.nombre}</td>
              <td className="py-2 px-3">{cli.empresa}</td>
              <td className="py-2 px-3">{cli.nit}</td>
              <td className="py-2 px-3">{cli.ciudad}</td>
              <td className="py-2 px-3">{cli.correo}</td>
              <td className="py-2 px-3">
                <Button
                  className="px-2 py-1 text-sm bg-red-500 hover:bg-red-600"
                  onClick={() => onDelete(cli.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EstadisticasFinancieras({ cuentas, clientes }) {
  const meses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul",
    "Ago", "Sep", "Oct", "Nov", "Dic"
  ];
  const ingresosPorMes = Array(12).fill(0);
  cuentas.forEach(cta => {
    if (cta.fecha) {
      const m = new Date(cta.fecha).getMonth();
      ingresosPorMes[m] += parseFloat(cta.total) || 0;
    }
  });
  const dataMeses = meses.map((mes, i) => ({
    mes,
    total: ingresosPorMes[i]
  }));

  const resumenClientes = {};
  cuentas.forEach(cta => {
    if (!resumenClientes[cta.clienteNombre])
      resumenClientes[cta.clienteNombre] = 0;
    resumenClientes[cta.clienteNombre] += parseFloat(cta.total) || 0;
  });
  const dataClientes = Object.keys(resumenClientes).map(k => ({
    name: k,
    value: resumenClientes[k]
  }));
  const COLORS = ["#29c4a9", "#6c63ff", "#2196f3", "#595e93", "#7f83b5", "#a5a9d7"];

  const total = cuentas.reduce((acc, cta) => acc + (parseFloat(cta.total) || 0), 0);
  const cantidad = cuentas.length;

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex gap-8 flex-wrap justify-center">
        <div className="bg-primary-100 px-8 py-6 rounded-2xl shadow-xl text-center">
          <div className="text-2xl font-extrabold text-primary-700">{cantidad}</div>
          <div className="text-gray-700 mt-1 font-medium">Cuentas de Cobro</div>
        </div>
        <div className="bg-accent-500/10 px-8 py-6 rounded-2xl shadow-xl text-center">
          <div className="text-2xl font-extrabold text-accent-600">${total.toLocaleString()}</div>
          <div className="text-gray-700 mt-1 font-medium">Total Cobrado</div>
        </div>
        <div className="bg-blue-500/10 px-8 py-6 rounded-2xl shadow-xl text-center">
          <div className="text-2xl font-extrabold text-blue-600">{clientes.length}</div>
          <div className="text-gray-700 mt-1 font-medium">Clientes Registrados</div>
        </div>
      </div>
      <div className="w-full grid md:grid-cols-2 gap-10">
        <div className="bg-white p-5 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="font-bold mb-2 text-primary-700">Ingresos por Mes</div>
          <ResponsiveContainer width="100%" minWidth={280} height={250}>
            <BarChart data={dataMeses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={v => `$${v.toLocaleString()}`} />
              <Bar dataKey="total" fill="#29c4a9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="font-bold mb-2 text-primary-700">Ingresos por Cliente</div>
          {dataClientes.length > 0 ? (
            <ResponsiveContainer width="100%" minWidth={280} height={250}>
              <PieChart>
                <Pie
                  data={dataClientes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {dataClientes.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 text-center pt-12">
              Aún no hay datos suficientes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
