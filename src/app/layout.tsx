import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rejoignez l'armée des phoners | Reconquête Paris 2026",
  description: "Devenez phoner pour Reconquête Paris 2026. 30 minutes depuis chez vous suffisent pour faire la différence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
