import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brand Kit Generator - Extract Brand Assets from Any Website",
  description: "Generate comprehensive brand kits from any website. Extract colors, typography, logos, and brand voice guidelines automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
