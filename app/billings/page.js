"use client";

import { PageTitle } from "../../components/PageTitle";
import { ProtectedPage } from "../../components/ProtectedPage";
import { BillingsTable } from "../../components/Tables";
import { useApp } from "../../components/AppProvider";
import { cleanNumber, money } from "../../lib/format";

export default function BillingsPage() {
  const { billings, createBilling, deleteBilling, failBilling, notify, payBilling, planName, plans, users } = useApp();

  async function handleCreate(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const body = {
      user_id: Number(data.user_id),
      plan_id: Number(data.plan_id),
      amount: cleanNumber(data.amount),
      due_date: `${data.due_date}T00:00:00Z`,
      description: data.description,
    };

    if (body.amount === undefined) delete body.amount;

    try {
      await createBilling(body);
      event.currentTarget.reset();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  return (
    <ProtectedPage>
      <PageTitle title="Счета" description="Создание счетов, просмотр статусов и отметка оплаты в billing-service." />
      <section className="grid">
        <div className="panel">
          <h2>Новый счет</h2>
          <form className="form compact" onSubmit={handleCreate}>
            <label>
              Пользователь
              <select name="user_id" required>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} · #{user.id}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Тариф
              <select name="plan_id" required>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} · {money(plan.price, plan.currency)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Сумма
              <input name="amount" type="number" min="0" step="0.01" placeholder="Auto" />
            </label>
            <label>
              Срок оплаты
              <input name="due_date" type="date" required />
            </label>
            <label>
              Описание
              <input name="description" placeholder="May subscription invoice" />
            </label>
            <button className="btn" type="submit" disabled={!users.length || !plans.length}>
              Создать
            </button>
          </form>
        </div>
        {billings.length ? (
          <BillingsTable
            billings={billings}
            planName={planName}
            onPay={payBilling}
            onFail={failBilling}
            onDelete={deleteBilling}
          />
        ) : (
          <div className="empty">Счета пока не созданы</div>
        )}
      </section>
    </ProtectedPage>
  );
}
