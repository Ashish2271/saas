import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { Providers } from "../provider";
import { AppbarClient } from "../components/AppbarClient";
import Providers from "../config/Providers";
import { Roboto_Flex } from "next/font/google";
import Header from "../components/header/Header";
import NavigationManager from "../components/navigation/NavigationManager";

// const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto_Flex({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});


export const metadata: Metadata = {
  title: "Wallet",
  description: "Simple wallet app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        
        <body className={roboto.className} style={{ margin: 0, minWidth: 320 }}>
          {/* <Header />
          <NavigationManager /> */}
          {children}
        </body>
      </Providers>
    </html>
  );
}
