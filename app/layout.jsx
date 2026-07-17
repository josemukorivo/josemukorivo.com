import { Inter, Newsreader } from "next/font/google";
import { ThemeScript } from "./_components/theme-script";
import "./globals.css";
import {
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_HANDLE,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL
} from "../lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Joseph Mukorivo"
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  classification: "Personal portfolio and software engineering writing",
  keywords: SITE_KEYWORDS,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        {
          url: "/feed.xml",
          title: `${SITE_NAME} — Writing`
        }
      ]
    }
  },
  icons: {
    icon: "/favicon.svg"
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: SITE_LOCALE
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: SITE_HANDLE
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  other: {
    "profile:first_name": "Joseph",
    "profile:last_name": "Mukorivo",
    "profile:username": "josemukorivo",
    "contact:email": SITE_EMAIL
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  }
};

export const viewport = {
  colorScheme: "light dark",
  themeColor: "#fdfdfc"
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-w-80 bg-canvas font-sans text-[15px] leading-[1.65] text-ink">
        {children}
      </body>
    </html>
  );
}
