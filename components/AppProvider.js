"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, DEFAULT_URLS, STORAGE_KEYS } from "../lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [booted, setBooted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState("");
  const [urls, setUrls] = useState(DEFAULT_URLS);
  const [currentUser, setCurrentUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [billings, setBillings] = useState([]);
  const [health, setHealth] = useState({ accounts: "unknown", billing: "unknown" });
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "ok") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4200);
  }, []);

  const request = useCallback(
    (service, path, options = {}, tokenOverride) =>
      apiRequest(service, path, options, { token: tokenOverride ?? token, urls }),
    [token, urls],
  );

  const checkHealth = useCallback(async () => {
    const checks = await Promise.allSettled([
      apiRequest("accounts", "/health", {}, { urls }),
      apiRequest("billing", "/health", {}, { urls }),
    ]);

    setHealth({
      accounts: checks[0].status === "fulfilled" ? "ok" : "bad",
      billing: checks[1].status === "fulfilled" ? "ok" : "bad",
    });
  }, [urls]);

  const refresh = useCallback(
    async (tokenOverride) => {
      const authToken = tokenOverride ?? token;
      if (!authToken) return;

      setBusy(true);
      try {
        const context = { token: authToken, urls };
        const [me, nextPlans, nextUsers, nextBillings] = await Promise.all([
          apiRequest("accounts", "/auth/me", {}, context),
          apiRequest("billing", "/plans", {}, context),
          apiRequest("accounts", "/users", {}, context),
          apiRequest("billing", "/billings", {}, context),
        ]);

        setCurrentUser(me);
        setPlans(nextPlans || []);
        setUsers(nextUsers || []);
        setBillings(nextBillings || []);
      } catch (error) {
        notify(error.message, "error");
        if (/unauthorized|expired|Authorization/i.test(error.message)) {
          signOut(false);
        }
      } finally {
        setBusy(false);
      }
    },
    [notify, token, urls],
  );

  function persistToken(nextToken) {
    setToken(nextToken);
    localStorage.setItem(STORAGE_KEYS.token, nextToken);
  }

  function signOut(showMessage = true) {
    setToken("");
    setCurrentUser(null);
    setPlans([]);
    setUsers([]);
    setBillings([]);
    localStorage.removeItem(STORAGE_KEYS.token);
    if (showMessage) notify("Вы вышли из панели");
  }

  async function login(payload) {
    const result = await apiRequest("accounts", "/auth/login", { method: "POST", body: payload }, { urls });
    persistToken(result.token);
    setCurrentUser(result.user);
    await refresh(result.token);
    notify("Добро пожаловать");
  }

  async function register(payload) {
    const result = await apiRequest("accounts", "/auth/register", { method: "POST", body: payload }, { urls });
    persistToken(result.token);
    setCurrentUser(result.user);
    await refresh(result.token);
    notify("Аккаунт создан");
  }

  async function createPlan(payload) {
    await request("billing", "/plans", { method: "POST", body: payload });
    await refresh();
    notify("Тариф создан");
  }

  async function updatePlan(id, payload) {
    await request("billing", `/plans/${id}`, { method: "PATCH", body: payload });
    await refresh();
    notify("Тариф обновлен");
  }

  async function deletePlan(id) {
    await request("billing", `/plans/${id}`, { method: "DELETE" });
    await refresh();
    notify("Тариф удален");
  }

  async function createUser(payload) {
    await request("accounts", "/users", { method: "POST", body: payload });
    await refresh();
    notify("Пользователь создан");
  }

  async function toggleUser(user) {
    await request("accounts", `/users/${user.id}`, {
      method: "PATCH",
      body: { is_active: !user.is_active },
    });
    await refresh();
    notify("Статус пользователя обновлен");
  }

  async function updateUserPlan(userID, planID) {
    await request("accounts", `/users/${userID}`, {
      method: "PATCH",
      body: { plan_id: Number(planID) },
    });
    await refresh();
    notify("Тариф пользователя обновлен");
  }

  async function deleteUser(id) {
    await request("accounts", `/users/${id}`, { method: "DELETE" });
    await refresh();
    notify("Пользователь удален");
  }

  async function createBilling(payload) {
    await request("billing", "/billings", { method: "POST", body: payload });
    await refresh();
    notify("Счет создан");
  }

  async function payBilling(id) {
    await request("billing", `/billings/${id}/pay`, { method: "PATCH" });
    await refresh();
    notify("Счет отмечен как оплаченный");
  }

  async function failBilling(id) {
    await request("billing", `/billings/${id}/fail`, { method: "PATCH" });
    await refresh();
    notify("Счет отмечен как failed");
  }

  async function deleteBilling(id) {
    await request("billing", `/billings/${id}`, { method: "DELETE" });
    await refresh();
    notify("Счет удален");
  }

  async function saveSettings(nextUrls) {
    const cleaned = {
      accounts: nextUrls.accounts.replace(/\/+$/, ""),
      billing: nextUrls.billing.replace(/\/+$/, ""),
    };

    setUrls(cleaned);
    localStorage.setItem(STORAGE_KEYS.accountsBaseUrl, cleaned.accounts);
    localStorage.setItem(STORAGE_KEYS.billingBaseUrl, cleaned.billing);
    notify("Настройки сохранены");
  }

  function planName(id) {
    const plan = plans.find((item) => Number(item.id) === Number(id));
    return plan ? plan.name : id ? `Plan #${id}` : "Без тарифа";
  }

  useEffect(() => {
    const nextToken = localStorage.getItem(STORAGE_KEYS.token) || "";
    const nextUrls = {
      accounts: localStorage.getItem(STORAGE_KEYS.accountsBaseUrl) || DEFAULT_URLS.accounts,
      billing: localStorage.getItem(STORAGE_KEYS.billingBaseUrl) || DEFAULT_URLS.billing,
    };

    setToken(nextToken);
    setUrls(nextUrls);
    setBooted(true);
  }, []);

  useEffect(() => {
    if (!booted) return;
    checkHealth();
    if (token) refresh(token);
  }, [booted, checkHealth, refresh, token]);

  const value = useMemo(
    () => ({
      booted,
      busy,
      token,
      urls,
      currentUser,
      plans,
      users,
      billings,
      health,
      toast,
      notify,
      login,
      register,
      signOut,
      refresh,
      checkHealth,
      saveSettings,
      createPlan,
      updatePlan,
      deletePlan,
      createUser,
      toggleUser,
      updateUserPlan,
      deleteUser,
      createBilling,
      payBilling,
      failBilling,
      deleteBilling,
      planName,
    }),
    [billings, booted, busy, checkHealth, currentUser, health, notify, plans, refresh, toast, token, urls, users],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast ? <div className={`toast ${toast.type === "error" ? "error" : ""}`}>{toast.message}</div> : null}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return value;
}
