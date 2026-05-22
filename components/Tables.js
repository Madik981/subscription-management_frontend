"use client";

import { dateTime, money } from "../lib/format";

export function UsersTable({ users, compact = false, planName, onToggle, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Тариф</th>
            <th>Статус</th>
            {!compact ? <th>Действие</th> : null}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>#{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{planName(user.plan_id)}</td>
              <td>
                <span className={`status ${user.is_active ? "active" : "inactive"}`}>
                  {user.is_active ? "active" : "inactive"}
                </span>
              </td>
              {!compact ? (
                <td>
                  <div className="actions row-actions">
                    <button className="btn small secondary" type="button" onClick={() => onToggle(user)}>
                      {user.is_active ? "Отключить" : "Активировать"}
                    </button>
                    <button className="btn small danger" type="button" onClick={() => onDelete(user.id)}>
                      Удалить
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BillingsTable({ billings, compact = false, planName, onPay, onFail, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Пользователь</th>
            <th>Тариф</th>
            <th>Сумма</th>
            <th>Срок</th>
            <th>Статус</th>
            {!compact ? <th>Действие</th> : null}
          </tr>
        </thead>
        <tbody>
          {billings.map((billing) => (
            <tr key={billing.id}>
              <td>#{billing.id}</td>
              <td>#{billing.user_id}</td>
              <td>{billing.plan?.name || planName(billing.plan_id)}</td>
              <td>{money(billing.amount, billing.plan?.currency || "USD")}</td>
              <td>{dateTime(billing.due_date)}</td>
              <td>
                <span className={`status ${billing.status}`}>{billing.status}</span>
              </td>
              {!compact ? (
                <td>
                  <div className="actions row-actions">
                    {billing.status === "pending" ? (
                      <>
                        <button className="btn small" type="button" onClick={() => onPay(billing.id)}>
                          Оплатить
                        </button>
                        <button className="btn small secondary" type="button" onClick={() => onFail(billing.id)}>
                          Failed
                        </button>
                      </>
                    ) : (
                      <span className="muted">{billing.status === "paid" ? dateTime(billing.paid_at) : "failed"}</span>
                    )}
                    <button className="btn small danger" type="button" onClick={() => onDelete(billing.id)}>
                      Удалить
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
