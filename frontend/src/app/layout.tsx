import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gem Crispy Confectionery | Premium Luxury Bakery & Confectionery",
  description: "Discover, buy, and explore premium bakery items, cakes, pastries, and confectionery. Enjoy our curated shop and exclusive treats.",
  openGraph: {
    title: "Gem Crispy Confectionery | Luxury Bakery & Premium Treats",
    description: "Discover, buy, and explore premium bakery items, cakes, pastries, and confectionery.",
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
      <body className="font-sans antialiased min-h-full bg-white text-black">
        {children}
      </body>
    </html>
  );
}
