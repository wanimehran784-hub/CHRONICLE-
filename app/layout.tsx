import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chronicle",
  description: "Every writer has a Chronicle.",
  verification: {
    google: "EN4dyDXypI1xNC896-XQ27e6IBpnSBD77v0N0PYpOds",
  },
  openGraph: {
    title: "Chronicle",
    description: "Every writer has a Chronicle.",
    url: "https://chronicle-rosy.vercel.app",
    siteName: "Chronicle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronicle",
    description: "Every writer has a Chronicle.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-serif">{children}</body>
    </html>
  );
}
