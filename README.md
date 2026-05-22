# Subscription Management Frontend

Next.js-фронтенд для двух Go-сервисов:

- Accounts API: `http://localhost:8080`
- Billing API: `http://localhost:8081`

## Страницы

- `/login`
- `/register`
- `/dashboard`
- `/plans`
- `/users`
- `/billings`
- `/settings`

## Запуск через Docker Compose

Из корня backend-проекта:

```bash
docker compose up --build -d
```

Фронтенд будет доступен на `http://localhost:3000`.

## Локальный запуск без Docker

Установите зависимости и запустите Next.js dev server:

```bash
npm install
npm run dev
```

После запуска откройте `http://localhost:3000`.

## Связка с backend

Фронтенд отправляет JWT в `Authorization: Bearer <token>` и обращается напрямую к двум сервисам. URL можно поменять во вкладке `Настройки`; значения сохраняются в `localStorage`.
