import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SportsFreunde - Dein Sport-Netzwerk",
  description: "Die Sport-App für Events und Community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
