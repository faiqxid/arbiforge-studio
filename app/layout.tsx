import type { Metadata } from "next";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "ArbiForge Studio";

export const metadata: Metadata = {
  title: appName,
  description: "Arbitrum-native AI planning studio for Escrow, Timelock, and Whitelist Vault deployments."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
