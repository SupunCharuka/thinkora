import React from "react";

const VARIANT_CLASSES = {
  indigo: "from-indigo-500 to-violet-500 text-white",
  teal: "from-emerald-400 to-teal-500 text-white",
  slate: "from-slate-700 to-slate-800 text-white",
};

export default function StatCard({ title, value, variant = "indigo", small }) {
  const variantCls = VARIANT_CLASSES[variant] || VARIANT_CLASSES.indigo;

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${variant === 'slate' ? 'bg-gradient-to-r ' + variantCls : 'bg-gradient-to-r ' + variantCls}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-90">{title}</div>
            <div className={`mt-1 ${small ? 'text-xl' : 'text-3xl'} font-extrabold`}>{value}</div>
          </div>

          <div className="opacity-80">
            <svg width="56" height="40" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 28 C12 12 24 30 36 18 S48 6 54 22" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)'}} />
    </div>
  );
}
