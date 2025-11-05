import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YogaLand TV - Admin Portal",
  description: "Manage your YogaLand TV content and advertisements",
  other: {
    ea2ff44ce04e183a89d24ac7cdbbb6bf7069748f:
      "ea2ff44ce04e183a89d24ac7cdbbb6bf7069748f",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Custom meta tag */}
        <meta
          name="ea2ff44ce04e183a89d24ac7cdbbb6bf7069748f"
          content="ea2ff44ce04e183a89d24ac7cdbbb6bf7069748f"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "text-sm sm:text-base font-small rounded-lg shadow-lg",
            style: { maxWidth: "90vw" },
            success: { style: { background: "#10B981", color: "#fff" } },
            error: { style: { background: "#EF4444", color: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
