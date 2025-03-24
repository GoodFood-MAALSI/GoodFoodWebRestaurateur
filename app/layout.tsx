import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ui/GoodFood/ClientLayout";

export const metadata: Metadata = {
  title: "GoodFood",
  description: "Plateforme de livraison tout-en-un pour les restaurants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}
