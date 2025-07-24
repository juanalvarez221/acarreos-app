import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function SectionTitle({ children, className }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "text-3xl md:text-4xl font-extrabold text-primary-700 mb-6 tracking-tight",
        className
      )}
    >
      {children}
    </motion.h1>
  );
}
