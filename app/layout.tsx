import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YogaLand TV - Admin Portal",
  description: "Manage your YogaLand TV content and advertisements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            success: {
              style: { background: "#10B981", color: "#fff" },
            },
            error: {
              style: { background: "#EF4444", color: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
