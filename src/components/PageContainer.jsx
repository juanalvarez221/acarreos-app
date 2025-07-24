import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function PageContainer({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className={clsx("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
