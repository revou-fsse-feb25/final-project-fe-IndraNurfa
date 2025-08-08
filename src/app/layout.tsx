"use client";
import { Navbar } from "@/components/navbar/navbar";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // List of routes that should NOT show Navbar
  const noNavbarRoutes = ["/login", "/signup", "/admin"];
  const isNavbarVisible = !noNavbarRoutes.some((path) =>
    pathname.startsWith(path),
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isNavbarVisible && <Navbar />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
