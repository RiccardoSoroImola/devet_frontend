import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"], // aggiungiamo i pesi usati nel design
});

export const metadata: Metadata = {
  title: "Diveat",
  description: "Ordina, condividi e paga facilmente al ristorante.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`
          ${inter.className}
          bg-gray-50
          text-gray-800
          antialiased
          flex justify-center
        `}
      >
        {/* Contenitore centrale mobile-first */}
        <div className="w-full max-w-md min-h-screen bg-white shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}

