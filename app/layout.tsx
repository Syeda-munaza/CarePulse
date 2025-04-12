import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ReduxToolkitProvider, {
  PersistGateProvider,
} from "@/redux/reduxProvider";

import { ThemeProvider } from "@/lib/theme-provider";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Carepulse",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cn(
          "min-h-screen bg-dark-300 font-sans antialiased",
          fontSans.variable
        )}`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ReduxToolkitProvider>
            <PersistGateProvider>{children}</PersistGateProvider>
          </ReduxToolkitProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
