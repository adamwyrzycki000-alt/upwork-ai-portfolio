import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Upfolio AI - AI Portfolio Generator for Upwork",
  description:
    "Generate professional PDF portfolios from Upwork job postings using AI. Find similar products, capture screenshots, and create tailored case studies.",
  keywords: ["portfolio", "upwork", "ai", "freelancer", "pdf", "generator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}