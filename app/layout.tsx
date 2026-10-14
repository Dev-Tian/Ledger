import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ToastProvider } from "@/components/ui/toaster";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMCT-Ledger",
  description: "Installment ledger for accounts, schedules, and payments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <ConnectionProvider>
            <ToastProvider>{children}</ToastProvider>
          </ConnectionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
