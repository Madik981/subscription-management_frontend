"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./AppProvider";

export function ProtectedPage({ children }) {
  const router = useRouter();
  const { booted, token } = useApp();

  useEffect(() => {
    if (booted && !token) {
      router.replace("/login");
    }
  }, [booted, router, token]);

  if (!booted) return <div className="empty">Загрузка панели...</div>;
  if (!token) return <div className="empty">Нужно войти в аккаунт.</div>;

  return children;
}
