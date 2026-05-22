"use client";

import { PageTitle } from "../../components/PageTitle";
import { ProtectedPage } from "../../components/ProtectedPage";
import { useApp } from "../../components/AppProvider";
import { money } from "../../lib/format";

export default function PlansPage() {
  const { createPlan, deletePlan, notify, plans, updatePlan } = useApp();

  async function handleCreate(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      await createPlan({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        currency: data.currency || "USD",
        billing_cycle: data.billing_cycle || "monthly",
      });
      event.currentTarget.reset();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function handleUpdate(event, id) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      await updatePlan(id, {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        currency: data.currency || "USD",
        billing_cycle: data.billing_cycle || "monthly",
      });
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function handleDelete(id) {
    try {
      await deletePlan(id);
    } catch (error) {
      notify(error.message, "error");
    }
  }

  return (
    <ProtectedPage>
      <PageTitle title="Тарифы" description="Создание и редактирование тарифных планов из billing-service." />
      <section className="grid">
        <div className="panel">
          <h2>Новый тариф</h2>
          <form className="form compact" onSubmit={handleCreate}>
            <label>
              Название
              <input name="name" placeholder="Pro" required />
            </label>
            <label>
              Цена
              <input name="price" type="number" min="0" step="0.01" required />
            </label>
            <label>
              Валюта
              <input name="currency" defaultValue="USD" maxLength={10} />
            </label>
            <label>
              Цикл
              <select name="billing_cycle" defaultValue="monthly">
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
                <option value="weekly">weekly</option>
              </select>
            </label>
            <label>
              Описание
              <input name="description" placeholder="Monthly plan" />
            </label>
            <button className="btn" type="submit">
              Создать
            </button>
          </form>
        </div>
        <div className="cards">
          {plans.length ? (
            plans.map((plan) => (
              <article className="card" key={plan.id}>
                <div className="card-head">
                  <div>
                    <h3>{plan.name}</h3>
                    <div className="muted">{plan.billing_cycle}</div>
                  </div>
                  <div className="price">{money(plan.price, plan.currency)}</div>
                </div>
                <p className="muted">{plan.description || "Описание не задано"}</p>
                <form className="form" onSubmit={(event) => handleUpdate(event, plan.id)}>
                  <label>
                    Название
                    <input name="name" defaultValue={plan.name} required />
                  </label>
                  <label>
                    Описание
                    <textarea name="description" defaultValue={plan.description} />
                  </label>
                  <div className="grid two">
                    <label>
                      Цена
                      <input name="price" type="number" min="0" step="0.01" defaultValue={plan.price} required />
                    </label>
                    <label>
                      Валюта
                      <input name="currency" defaultValue={plan.currency} maxLength={10} />
                    </label>
                  </div>
                  <label>
                    Цикл
                    <input name="billing_cycle" defaultValue={plan.billing_cycle} />
                  </label>
                  <div className="actions">
                    <button className="btn secondary" type="submit">
                      Сохранить
                    </button>
                    <button className="btn danger" type="button" onClick={() => handleDelete(plan.id)}>
                      Удалить
                    </button>
                  </div>
                </form>
              </article>
            ))
          ) : (
            <div className="empty">Тарифы пока не созданы</div>
          )}
        </div>
      </section>
    </ProtectedPage>
  );
}
