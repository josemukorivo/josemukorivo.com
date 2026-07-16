import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: "500",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap"
});

const title = "Joseph Mukorivo — Head of Engineering & founder";
const description =
  "Joseph Mukorivo is an engineering leader, founder, and product builder creating thoughtful systems and polished digital products.";

export const metadata = {
  metadataBase: new URL("https://www.josemukorivo.com"),
  title: {
    default: title,
    template: "%s — Joseph Mukorivo"
  },
  description,
  authors: [{ name: "Joseph Mukorivo" }],
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title,
    description:
      "Head of Engineering, founder of FortyOne and Complexus, and product builder.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/assets/joseph.webp",
        alt: "Joseph Mukorivo"
      }
    ]
  }
};

export const viewport = {
  themeColor: "#fdfdfc"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
