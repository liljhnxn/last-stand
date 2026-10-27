import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "LastStand | One Life. One Chance. How Long Can You Survive?",
  description:
    "LastStand is a Web3 survival mini-game on Botchain Testnet. Face 10 intense rounds of danger, push your luck, and record your survival legacy on-chain.",
  keywords: ["LastStand", "Botchain", "Web3 Game", "Survival Game", "Solidity", "BOT"],
  openGraph: {
    title: "LastStand - One Life. One Chance.",
    description: "How long can you survive on Botchain Testnet?",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#08090C] text-gray-100 antialiased selection:bg-purple-600 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
