import { useState } from "react";
import { Menu, X, FileText, Users, PlusCircle, BarChart3 } from "lucide-react";
import logo from "../assets/logo.png";

const NAV = [
  { label: "Cuentas", value: "cuentas", icon: FileText },
  { label: "Nueva cuenta", value: "nueva", icon: PlusCircle },
  { label: "Clientes", value: "clientes", icon: Users },
  { label: "Estadísticas", value: "estadisticas", icon: BarChart3 },
];

export default function ResponsiveSidebar({ section, setSection }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sidebar fijo solo en md+ */}
      <aside className="hidden md:flex flex-col bg-white/90 border-r border-gray-200 fixed top-0 left-0 h-screen w-72 z-40 shadow-xl p-4 gap-4">
        <div className="mb-8 mt-2 flex items-center gap-3 px-2">
          <img src={logo} alt="Logo" className="h-10 w-auto rounded-xl shadow" />
          <span className="font-extrabold text-2xl text-primary-700 tracking-tight">AcarreosApp</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <SidebarLink
              key={item.value}
              active={section === item.value}
              onClick={() => setSection(item.value)}
              icon={item.icon}
            >
              {item.label}
            </SidebarLink>
          ))}
        </nav>
        <div className="mt-auto p-3 text-xs text-gray-400 text-center">
          Desarrollado por tu hijo 🫶<br />v1.0
        </div>
      </aside>

      {/* Navbar para móviles */}
      <header className="md:hidden flex items-center justify-between bg-white/90 px-3 py-2 border-b border-gray-200 shadow z-50 sticky top-0">
        <button
          onClick={() => setOpen(true)}
          className="text-primary-700"
          aria-label="Abrir menú"
        >
          <Menu size={32} />
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-auto rounded-xl shadow" />
          <span className="font-extrabold text-xl text-primary-700 tracking-tight">
            Acarreos Angel Alvarez
          </span>
        </div>
        <span className="w-8" /> {/* Espacio para el icono */}
      </header>

      {/* Sidebar deslizable en mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      >
        <nav
          className={`absolute top-0 left-0 h-full w-64 bg-white shadow-xl p-4 transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="mb-8 text-primary-700"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={32} />
          </button>
          <div className="mb-8 mt-2 flex items-center gap-3 px-2">
            <img src={logo} alt="Logo" className="h-10 w-auto rounded-xl shadow" />
            <span className="font-extrabold text-2xl text-primary-700 tracking-tight">AcarreosApp</span>
          </div>
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <SidebarLink
                key={item.value}
                active={section === item.value}
                onClick={() => {
                  setSection(item.value);
                  setOpen(false);
                }}
                icon={item.icon}
              >
                {item.label}
              </SidebarLink>
            ))}
          </div>
          <div className="mt-auto p-3 text-xs text-gray-400 text-center">
            Desarrollado por tu hijo, te amo papá 🫶<br />v1.0
          </div>
        </nav>
      </div>
    </>
  );
}

function SidebarLink({ children, active, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl font-bold text-lg transition
        ${active ? "bg-accent-500 text-white shadow-md" : "text-primary-700 hover:bg-primary-100"}
      `}
    >
      <Icon size={22} className="opacity-70" />
      <span>{children}</span>
    </button>
  );
}
