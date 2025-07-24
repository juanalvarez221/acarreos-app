import { motion } from "framer-motion";
import { LayoutDashboard, FilePlus2, LogOut } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { name: "Cuentas", icon: LayoutDashboard, section: "cuentas" },
  { name: "Nueva Cuenta", icon: FilePlus2, section: "nueva" },
];

export default function Sidebar({ section, setSection }) {
  return (
    <aside className="w-72 bg-white/80 border-r border-gray-200 shadow-xl fixed h-full z-20 flex flex-col py-8 px-6 gap-10">
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-primary-700 p-3 rounded-2xl"
        >
          <svg width="34" height="34" fill="none" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="24" fill="#29c4a9" />
            <path d="M16 34V18h16v16" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round"/>
            <rect x="19" y="24" width="10" height="10" rx="2" fill="#fff"/>
          </svg>
        </motion.div>
        <span className="font-bold text-xl text-primary-700 tracking-wide">Cobros Pro</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.section}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-all",
              section === item.section
                ? "bg-primary-100 text-primary-700 shadow"
                : "text-gray-700 hover:bg-primary-50"
            )}
            onClick={() => setSection(item.section)}
          >
            <item.icon size={22} className="mr-1" />
            {item.name}
          </button>
        ))}
      </nav>
      <div className="flex-grow" />
      <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium text-gray-600 hover:bg-primary-50 transition">
        <LogOut size={22} className="mr-1" />
        Cerrar sesión
      </button>
    </aside>
  );
}
