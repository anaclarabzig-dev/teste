"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/calendario", label: "Calendário" },
  { href: "/ferias", label: "Férias" },
  { href: "/producao-textos", label: "Produção de Textos" },
  { href: "/imprensa", label: "Imprensa" },
  { href: "/design-multimidia", label: "Design & Multimídia" },
  { href: "/equipes", label: "Equipes" },
  { href: "/historico", label: "Histórico" },
];

export default function AppShell({
  children,
  userName,
  userRole,
  userSetor,
}: {
  children: ReactNode;
  userName: string;
  userRole: string;
  userSetor?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-neutral-200 bg-white md:flex">
        <div className="border-b border-neutral-200 px-5 py-4">
          <p className="text-base font-semibold text-neutral-900">DirCom Online</p>
          <p className="text-xs text-neutral-500">Atividades &amp; Calendários</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-neutral-200 px-4 py-4">
          <p className="truncate text-sm font-medium text-neutral-900">{userName}</p>
          <p className="text-xs text-neutral-500">
            {userRole === "ADMIN" ? "Administrador" : userSetor === "AGENCIA" ? "Agência" : "Imprensa"}
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Sair
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
          <p className="text-base font-semibold text-neutral-900">DirCom Online</p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700"
          >
            Sair
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200 bg-white px-2 py-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 bg-neutral-50 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
