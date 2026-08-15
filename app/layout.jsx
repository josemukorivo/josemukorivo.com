import { Newsreader, Shantell_Sans } from "next/font/google";
import { SiteDock } from "./_components/site-dock";
import { ThemeScript } from "./_components/theme-script";
import { RevealObserver } from "./reveal-observer";
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

const shantellSans = Shantell_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: "italic",
  variable: "--font-shantell-sans",
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
  classification:
    "Personal portfolio, AI product engineering, and software engineering writing",
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
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon"
      },
      {
        url: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16"
      },
      {
        url: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32"
      }
    ],
    apple: "/apple-touch-icon.png"
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
  themeColor: "#fbfaf5"
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${shantellSans.variable} ${newsreader.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-w-80 bg-canvas font-body text-[14px] leading-[1.65] text-ink italic">
        <RevealObserver />
        <div
          aria-hidden="true"
          className="viewport-blur viewport-blur--top"
        />
        <div
          aria-hidden="true"
          className="viewport-blur viewport-blur--bottom"
        />
        {children}
        <SiteDock />
      </body>
    </html>
  );
}
