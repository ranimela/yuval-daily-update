import type { Metadata } from "next";
import { Heebo, Lilita_One, Nunito } from "next/font/google";
import "./globals.css";

const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lilita",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "800"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "Daily Dose for Yuval",
  description: "Four things to get your brain going.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lilitaOne.variable} ${nunito.variable} ${heebo.variable}`}
    >
      <body className="min-h-screen bg-sky font-body text-[16px] font-semibold leading-[1.45] text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
