import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function Button({ children, className, icon: Icon, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3 font-semibold text-lg shadow-xl bg-accent-500 hover:bg-accent-600 transition focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 text-white",
        className
      )}
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  );
}
