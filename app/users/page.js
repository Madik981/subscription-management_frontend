"use client";

import { PageTitle } from "../../components/PageTitle";
import { ProtectedPage } from "../../components/ProtectedPage";
import { UsersTable } from "../../components/Tables";
import { useApp } from "../../components/AppProvider";
import { cleanNumber, money } from "../../lib/format";

export default function UsersPage() {
  const { createUser, deleteUser, notify, planName, plans, toggleUser, updateUserPlan, users } = useApp();

  async function handleCreate(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const body = {
      name: data.name,
      email: data.email,
      plan_id: cleanNumber(data.plan_id),
      is_active: form.elements.is_active.checked,
    };

    if (!body.plan_id) delete body.plan_id;

    try {
      await createUser(body);
      form.reset();
      form.elements.is_active.checked = true;
    } catch (error) {
      notify(error.message, "error");
    }
  }

  return (
    <ProtectedPage>
      <PageTitle title="Пользователи" description="Создание пользователей и управление активностью в accounts-service." />
      <section className="grid">
        <div className="panel">
          <h2>Новый пользователь</h2>
          <form className="form compact" onSubmit={handleCreate}>
            <label>
              Имя
              <input name="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" required />
            </label>
            <label>
              Тариф
              <select name="plan_id" defaultValue="">
                <option value="">Без тарифа</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} · {money(plan.price, plan.currency)}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-check">
              <input name="is_active" type="checkbox" defaultChecked /> Активен
            </label>
            <button className="btn" type="submit">
              Создать
            </button>
          </form>
        </div>
        {users.length ? (
          <UsersTable
            users={users}
            plans={plans}
            planName={planName}
            onToggle={toggleUser}
            onPlanChange={updateUserPlan}
            onDelete={deleteUser}
          />
        ) : (
          <div className="empty">Пользователи пока не созданы</div>
        )}
      </section>
    </ProtectedPage>
  );
}
