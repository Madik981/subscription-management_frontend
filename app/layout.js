import "./globals.css";
import { AppProvider } from "../components/AppProvider";
import { AppHeader } from "../components/AppHeader";

export const metadata = {
  title: "Subscription Management",
  description: "Accounts and billing management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AppProvider>
          <AppHeader />
          <main className="content">
            <div className="page-frame page-content">{children}</div>
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
