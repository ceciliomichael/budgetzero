import type { Metadata } from "next";
import "./globals.css";
import { BudgetProvider } from "@/contexts/budget-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "BudgetZero - Simple Budget Management App",
  description: "A simple budget tracking application to help you manage your finances",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col transition-colors duration-300">
        <BudgetProvider>
          <div className="fixed inset-0 w-full h-full bg-slate-50 dark:aurora-bg -z-10"></div>
          <div className="fixed inset-0 w-full h-full bg-slate-50/50 dark:bg-dark-surface/80 backdrop-blur-sm -z-10"></div>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </BudgetProvider>
      </body>
    </html>
  );
}
