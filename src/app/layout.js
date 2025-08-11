import "@/app/globals.css";
import ClientProviders from "@/components/ClientProviders";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: "Collaborative Whiteboard Application - Real-time Drawing & Collaboration",
  description: "Experience seamless real-time collaboration with our Collaborative Whiteboard Application.",
  keywords: ["Collaborative Whiteboard", "Real-time Drawing", "Next.js", "Socket.IO"],
  authors: [{ name: "Zvezda Neycheva" }],
  robots: "index, follow",
  openGraph: {
    title: "Collaborative Whiteboard Application - Real-time Drawing & Collaboration",
    description: "Collaborate in real-time with our online whiteboard app.",
    url: "https://yourappdomain.com",
    siteName: "Whiteboard Project",
    images: [
      {
        url: "/Screenshot.png",
        width: 1200,
        height: 630,
        alt: "Whiteboard Screenshot",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collaborative Whiteboard Application - Real-time Drawing",
    description: "Real-time whiteboard with Next.js and Socket.IO",
    images: ["/Screenshot.png"],
  },
};

export const themeColor = '#ffffff';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <noscript>
          <style>{`body { display: block; }`}</style>
          JavaScript is required to run this application.
        </noscript>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}