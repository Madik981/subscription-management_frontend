"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageTitle } from "../../components/PageTitle";
import { useApp } from "../../components/AppProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, notify } = useApp();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      await login(data);
      router.push("/dashboard");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  return (
    <section className="auth-wrap grid">
      <PageTitle title="Вход" description="Авторизуйтесь, чтобы управлять тарифами, пользователями и счетами." />
      <div className="panel">
        <h2>Войти в панель</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Пароль
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <div className="actions">
            <button className="btn" type="submit">
              Войти
            </button>
            <Link className="btn secondary" href="/register">
              Создать аккаунт
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
