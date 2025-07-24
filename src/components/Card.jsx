import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function Card({ children, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38 }}
      className={clsx(
        "bg-white rounded-2xl shadow-xl px-8 py-7",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
