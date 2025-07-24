import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function Toaster({ message, type = "success", show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={clsx(
          "fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-lg font-semibold",
          type === "success"
            ? "bg-accent-500 text-white"
            : "bg-red-500 text-white"
        )}
      >
        {type === "success" ? (
          <CheckCircle2 size={24} />
        ) : (
          <AlertTriangle size={24} />
        )}
        {message}
      </motion.div>
    </AnimatePresence>
  );
}
