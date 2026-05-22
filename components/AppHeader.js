"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "./AppProvider";
import { initials } from "../lib/format";

const navItems = [
  { href: "/dashboard", label: "Обзор" },
  { href: "/plans", label: "Тарифы" },
  { href: "/users", label: "Пользователи" },
  { href: "/billings", label: "Счета" },
  { href: "/settings", label: "Настройки" },
];

function HealthDot({ value }) {
  return <span className={`dot ${value === "ok" ? "ok" : value === "bad" ? "bad" : ""}`} />;
}

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, health, signOut, token } = useApp();

  function handleLogout() {
    signOut();
    router.push("/login");
  }

  return (
    <header className="app-header">
      <div className="page-frame header-main">
        <Link className="brand" href="/dashboard">
          <span className="mark" aria-hidden="true" />
          <span>
            <strong>Subscription Management</strong>
            <small>Accounts + Billing</small>
          </span>
        </Link>
        <div className="service-status" aria-label="API status">
          <span>
            <HealthDot value={health.accounts} /> Accounts
          </span>
          <span>
            <HealthDot value={health.billing} /> Billing
          </span>
        </div>
        {currentUser ? (
          <div className="profile">
            <div className="avatar">{initials(currentUser)}</div>
            <div>
              <strong>{currentUser.name}</strong>
              <span>{currentUser.email}</span>
            </div>
          </div>
        ) : (
          <Link className="btn header-login" href="/login">
            Войти
          </Link>
        )}
      </div>
      <nav className="nav">
        {navItems.map((item) => (
          <Link key={item.href} className={pathname === item.href ? "active" : ""} href={item.href}>
            {item.label}
          </Link>
        ))}
        {token ? (
          <button type="button" onClick={handleLogout}>
            Выйти
          </button>
        ) : (
          <>
            <Link className={pathname === "/login" ? "active" : ""} href="/login">
              Вход
            </Link>
            <Link className={pathname === "/register" ? "active" : ""} href="/register">
              Регистрация
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
