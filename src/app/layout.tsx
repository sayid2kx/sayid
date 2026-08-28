import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sarowar Jahan Sayid - Hardware Business Owner | Shahin Machinery",
  description:
    "Computer Science graduate and entrepreneur running Shahin Machinery and Hardware Store in Mymensingh, Bangladesh. Quality machinery, cycle parts, and general hardware supplies.",
  keywords: [
    "Hardware Store",
    "Machinery",
    "Cycle Parts",
    "Business",
    "Entrepreneur",
    "Mymensingh",
    "Bangladesh",
    "Shahin Machinery",
  ],
  authors: [{ name: "Sarowar Jahan Sayid" }],
  openGraph: {
    title: "Sarowar Jahan Sayid - Hardware Business Owner | Shahin Machinery",
    description:
      "Computer Science graduate turned entrepreneur managing Shahin Machinery and Hardware Store in Mymensingh.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarowar Jahan Sayid - Hardware Business Owner",
    description:
      "Managing Shahin Machinery and Hardware Store in Mymensingh, Bangladesh",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("portfolio-theme");var v=["garden","cupertino","paper","studio"];var t=v.indexOf(s)!==-1?s:"garden";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","garden");}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${instrument.variable} ${jetbrains.variable} min-h-full flex flex-col bg-background text-foreground antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
