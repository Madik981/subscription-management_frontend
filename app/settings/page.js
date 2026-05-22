"use client";

import { PageTitle } from "../../components/PageTitle";
import { ProtectedPage } from "../../components/ProtectedPage";
import { useApp } from "../../components/AppProvider";

function HealthDot({ value }) {
  return <span className={`dot ${value === "ok" ? "ok" : value === "bad" ? "bad" : ""}`} />;
}

export default function SettingsPage() {
  const { checkHealth, health, notify, saveSettings, urls } = useApp();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      await saveSettings({ accounts: data.accountsBaseUrl, billing: data.billingBaseUrl });
      await checkHealth();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function handleCheck() {
    await checkHealth();
    notify("Проверка API завершена");
  }

  return (
    <ProtectedPage>
      <PageTitle title="Настройки" description="URL двух Go-сервисов и состояние подключения фронтенда." />
      <section className="grid two">
        <div className="panel">
          <h2>API endpoints</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Accounts service URL
              <input name="accountsBaseUrl" defaultValue={urls.accounts} required />
            </label>
            <label>
              Billing service URL
              <input name="billingBaseUrl" defaultValue={urls.billing} required />
            </label>
            <div className="actions">
              <button className="btn" type="submit">
                Сохранить
              </button>
              <button className="btn secondary" type="button" onClick={handleCheck}>
                Проверить
              </button>
            </div>
          </form>
        </div>
        <div className="panel">
          <h2>Состояние</h2>
          <p>
            <HealthDot value={health.accounts} /> Accounts: <strong>{health.accounts}</strong>
          </p>
          <p>
            <HealthDot value={health.billing} /> Billing: <strong>{health.billing}</strong>
          </p>
          <p className="muted">JWT хранится в localStorage и отправляется в оба сервиса как Authorization: Bearer.</p>
        </div>
      </section>
    </ProtectedPage>
  );
}
