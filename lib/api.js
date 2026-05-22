export const DEFAULT_URLS = {
  accounts: "http://localhost:8080",
  billing: "http://localhost:8081",
};

export const STORAGE_KEYS = {
  token: "subscription_management_token",
  accountsBaseUrl: "subscription_management_accounts_url",
  billingBaseUrl: "subscription_management_billing_url",
};

export async function apiRequest(service, path, options = {}, context = {}) {
  const urls = context.urls || DEFAULT_URLS;
  const token = context.token || "";
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${urls[service]}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = data?.error || data?.message || `${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return data;
}
