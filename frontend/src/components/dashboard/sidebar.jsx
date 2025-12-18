import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Icon({ name }) {
  const props = { width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 1.5 };
  switch (name) {
    case "overview":
      return (
        <svg {...props} viewBox="0 0 24 24" className="text-indigo-400">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "categories":
      return (
        <svg {...props} viewBox="0 0 24 24" className="text-yellow-400">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      );
    case "create":
      return (
        <svg {...props} viewBox="0 0 24 24" className="text-pink-400">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      );
    case "blogs":
      return (
        <svg {...props} viewBox="0 0 24 24" className="text-blue-400">
          <path d="M4 7h16v10H4z" strokeLinejoin="round" />
          <path d="M8 11h8" strokeLinecap="round" />
        </svg>
      );
    case "hero":
      return (
        <svg {...props} viewBox="0 0 24 24" className="text-red-400">
          <path d="M12 2l3 7h7l-5.6 4.1L20 22l-8-5-8 5 2.6-8.9L1 9h7z" />
        </svg>
      );
    case "profile":
      return (
        <svg {...props} viewBox="0 0 24 24" className="text-violet-400">
          <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
          <path d="M6 20a6 6 0 0112 0" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ mobile = false, onClose }) {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Overview", icon: "overview" },
    { href: "/dashboard/categories", label: "Categories", icon: "categories" },
    { href: "/dashboard/create-blog", label: "Create blog", icon: "create" },
    { href: "/dashboard/blogs", label: "View blogs", icon: "blogs" },
    { href: "/dashboard/hero", label: "Hero selector", icon: "hero" },
    { href: "/dashboard/profile", label: "Profile", icon: "profile" },
  ];

  return (
    <div className="h-full p-6 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-sm border-r border-white/5 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center text-white shadow">
            <span className="font-bold">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Analytics</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
        {mobile && (
          <button onClick={() => onClose && onClose()} aria-label="Close sidebar" className="ml-4 p-2 rounded-md bg-white/6 hover:bg-white/8 transition">
            ✕
          </button>
        )}
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {items.map((it) => {
            const active = pathname === it.href || pathname?.startsWith(it.href + "/");
            return (
              <li key={it.href}>
                <Link href={it.href} className={`flex items-center gap-3 px-3 py-2 rounded-md transition transform hover:translate-x-1 hover:bg-white/5 ${active ? 'bg-white/6 shadow-inner border-l-4 border-indigo-400' : ''}`} aria-current={active ? 'page' : undefined}>
                  <Icon name={it.icon} />
                  <span className="text-sm font-medium">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
