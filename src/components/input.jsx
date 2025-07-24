import { clsx } from "clsx";

export default function Input({ label, className, ...props }) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      {label && (
        <label className="text-gray-700 text-base font-semibold mb-1">{label}</label>
      )}
      <input
        className={clsx(
          "w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none text-lg bg-gray-100 transition",
          className
        )}
        {...props}
      />
    </div>
  );
}
