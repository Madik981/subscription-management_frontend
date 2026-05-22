"use client";

import { PageTitle } from "../../components/PageTitle";
import { ProtectedPage } from "../../components/ProtectedPage";
import { BillingsTable, UsersTable } from "../../components/Tables";
import { useApp } from "../../components/AppProvider";
import { money } from "../../lib/format";

export default function DashboardPage() {
  const { billings, busy, payBilling, planName, plans, toggleUser, users } = useApp();
  const paid = billings.filter((billing) => billing.status === "paid");
  const pending = billings.filter((billing) => billing.status === "pending");
  const revenue = paid.reduce((sum, billing) => sum + Number(billing.amount || 0), 0);

  return (
    <ProtectedPage>
      <PageTitle title="Обзор" description={busy ? "Обновляю данные..." : "Главные показатели accounts-service и billing-service."} />
      <section className="grid">
        <div className="grid three">
          <div className="panel metric">
            <span>Пользователи</span>
            <strong>{users.length}</strong>
          </div>
          <div className="panel metric">
            <span>Активные тарифы</span>
            <strong>{plans.length}</strong>
          </div>
          <div className="panel metric">
            <span>Оплачено</span>
            <strong>{money(revenue)}</strong>
          </div>
        </div>
        <div className="grid two">
          <div className="panel">
            <h2>Ожидают оплаты</h2>
            {pending.length ? (
              <BillingsTable billings={pending.slice(0, 5)} compact planName={planName} onPay={payBilling} />
            ) : (
              <div className="empty">Нет ожидающих счетов</div>
            )}
          </div>
          <div className="panel">
            <h2>Последние пользователи</h2>
            {users.length ? (
              <UsersTable users={users.slice(0, 5)} compact planName={planName} onToggle={toggleUser} />
            ) : (
              <div className="empty">Пользователи пока не созданы</div>
            )}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
