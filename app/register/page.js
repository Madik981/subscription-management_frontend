"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageTitle } from "../../components/PageTitle";
import { useApp } from "../../components/AppProvider";
import { cleanNumber } from "../../lib/format";

export default function RegisterPage() {
  const router = useRouter();
  const { notify, register } = useApp();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const body = {
      name: data.name,
      email: data.email,
      password: data.password,
      plan_id: cleanNumber(data.plan_id),
    };

    if (!body.plan_id) delete body.plan_id;

    try {
      await register(body);
      router.push("/dashboard");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  return (
    <section className="auth-wrap grid">
      <PageTitle title="Регистрация" description="Создайте аккаунт в accounts-service и получите JWT для работы с API." />
      <div className="panel">
        <h2>Новый аккаунт</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Имя
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Пароль
            <input name="password" type="password" minLength={6} autoComplete="new-password" required />
          </label>
          <label>
            ID тарифа
            <input name="plan_id" type="number" min="1" placeholder="Опционально" />
          </label>
          <div className="actions">
            <button className="btn" type="submit">
              Зарегистрироваться
            </button>
            <Link className="btn secondary" href="/login">
              Уже есть аккаунт
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
