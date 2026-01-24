import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linkt - Documentation that stays in sync",
  description: "Keep your technical documentation in sync with code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}