import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restaurace U Matěje - Luxusní gastronomie v srdci Prahy",
  description: "Restaurace u Matěje, zaměřená na luxusní jídla — website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
