import { motion } from "framer-motion";
import { FilePlus2 } from "lucide-react";

export default function EmptyState({ title = "Sin cuentas de cobro", description = "Crea tu primera cuenta para empezar.", action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="bg-accent-500/10 text-accent-500 rounded-full p-5 mb-4">
        <FilePlus2 size={38} />
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
