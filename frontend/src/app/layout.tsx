import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gem Crispy Confectioneries | Premium Snacks, Training & Equipment",
  description: "Gem Crispy Confectioneries specializes in the production of premium Plantain Chips, Peanut Burger, and Kuli Kuli while empowering entrepreneurs through hands-on training and equipment supply.",
  openGraph: {
    title: "Gem Crispy Confectioneries | Premium Snacks, Training & Equipment",
    description: "Gem Crispy Confectioneries specializes in the production of premium Plantain Chips, Peanut Burger, and Kuli Kuli while empowering entrepreneurs through hands-on training and equipment supply.",
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
      <body className="font-sans antialiased min-h-full bg-white text-black" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
