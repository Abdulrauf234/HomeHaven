import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home Haven | Premium Luxury Real Estate & E-Commerce",
  description: "Discover, buy, and rent verified premium properties, villas, apartments, and duplexes. Explore our exclusive home decor and furniture shop.",
  keywords: "luxury real estate, rent apartments, buy villa, duplex, home decor shop, luxury home furniture",
  authors: [{ name: "Home Haven Team" }],
  openGraph: {
    title: "Home Haven | Luxury Real Estate & Premium Living Store",
    description: "Discover, buy, and rent verified premium properties, villas, apartments, and duplexes.",
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
