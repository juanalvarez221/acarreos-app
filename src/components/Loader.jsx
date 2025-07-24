import { motion } from "framer-motion";

export default function Loader({ className }) {
  return (
    <div className={className}>
      <motion.span
        className="inline-block w-8 h-8 rounded-full border-4 border-accent-500 border-t-transparent animate-spin"
        aria-label="Cargando"
      />
    </div>
  );
}
