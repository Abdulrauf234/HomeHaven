import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELS Gadget | Premium Modern Tech Hub",
  description: "Discover quality gadgets, flagship smartphones, ultrabooks, smartwatches, and audio equipment. Modern technology. Clear design. Zero clutter.",
  openGraph: {
    title: "ELS Gadget | Premium Modern Tech Hub",
    description: "Discover quality gadgets, flagship smartphones, ultrabooks, smartwatches, and audio equipment.",
    type: "website",
    locale: "en_US",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-full bg-white text-neutral-900 selection:bg-black selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

