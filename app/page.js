"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../components/AppProvider";

export default function HomePage() {
  const router = useRouter();
  const { token, booted } = useApp();

  useEffect(() => {
    if (!booted) return;
    router.replace(token ? "/dashboard" : "/login");
  }, [booted, router, token]);

  return <div className="empty">Загрузка панели...</div>;
}
