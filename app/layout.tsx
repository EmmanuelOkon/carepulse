import type { Metadata } from "next";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
// Supports weights 200-800
import "@fontsource-variable/plus-jakarta-sans";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CarePulse",
  description:
    "A healthcare patient management System designed to streamline patient registration, appointment scheduling, and medical records management for healthcare providers.",
  icons: {
    icon: "/assets/icons/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // suppressHydrationWarning={true}
        suppressHydrationWarning
        className={cn("min-h-screen bg-dark-300 antialiased")}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
