import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Supports weights 200-800
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
        className={cn(
          "min-h-screen bg-dark-300 antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <Toaster richColors theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
