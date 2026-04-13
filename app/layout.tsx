import type { Metadata } from "next";
import { Hind_Siliguri, Sora } from "next/font/google";
import Script from "next/script";

import { VocabProvider } from "@/components/providers/vocab-provider";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind"
});

export const metadata: Metadata = {
  title: "VocabMaster",
  description: "IELTS vocabulary practice with spaced repetition and daily streaks."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var key='vocabmaster.theme';var saved=localStorage.getItem(key);var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=saved?saved==='dark':prefersDark;document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`}
        </Script>
      </head>
      <body className={`${sora.variable} ${hindSiliguri.variable} bg-slate-50 text-slate-900 antialiased`}>
        <VocabProvider>{children}</VocabProvider>
      </body>
    </html>
  );
}
