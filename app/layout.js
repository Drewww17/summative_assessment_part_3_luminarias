import { Inter } from "next/font/google";
import "./globals.css";  // <--- THIS LINE IS CRITICAL

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "F1 Dashboard",
  description: "Live F1 Data",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}