// app/layout.js
"use client";
import "@/app/globals.css";
import Head from 'next/head';
import { RecoilRoot } from "recoil";
import Logout from "@/components/Logout";
import  UserAvatar  from "@/components/UserAvatar";
import { useRouter } from 'next/navigation';

export const metadata = {
  title: 'Collaborative Whiteboard Application - Real-time Drawing & Collaboration',
  description: 'Experience seamless real-time collaboration with our Collaborative Whiteboard Application. Built using Next.js and Socket.IO, it allows users to draw and interact live on a shared whiteboard.',
  
  // Open Graph Meta Tags for Social Sharing
  openGraph: {
    title: 'Collaborative Whiteboard Application - Real-time Drawing & Collaboration',
    description: 'Collaborate in real-time with our online whiteboard app. Powered by Next.js and Socket.IO, this app offers a seamless drawing experience with real-time updates and user authentication.',
    url: 'https://yourappdomain.com', // Replace after deployment
    siteName: 'Whiteboard Project',
    images: [
      {
        url: 'https://via.placeholder.com/1200x630', // Replace 
        width: 1200,
        height: 630,
        alt: 'Placeholder for Collaborative Whiteboard Application',
      },
    ],
    type: 'website',
  },

  // Twitter Card Tags for Twitter sharing
  twitter: {
    card: 'summary_large_image',
    title: 'Collaborative Whiteboard Application - Real-time Drawing & Collaboration',
    description: 'Collaborate in real-time on a shared virtual whiteboard. Built with Next.js and Socket.IO, offering live updates and secure user authentication.',
    images: ['https://via.placeholder.com/1200x630'], // Replace 
  },

  // Other SEO Meta Tags
  keywords: ['Collaborative Whiteboard', 'Real-time Drawing', 'Next.js', 'Socket.IO', 'Online Whiteboard App', 'User Authentication'],
  authors: [{ name: 'Zvezda Neycheva', url: 'https://github.com/DreamersJS' }], 

  // Optional additional tags
  robots: 'index, follow', // Controls whether search engines should index this page and follow links on it
  viewport: 'width=device-width, initial-scale=1', // Ensures responsive design
  themeColor: '#ffffff', // Mobile browsers can show this color for the URL bar
};


export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <html lang="en" className="h-full">
      {/* <Head>
        <title>Online Drawing Whiteboard App</title>
        <meta name="description" content="Collaborate on a whiteboard in real-time" />
        <meta property="og:title" content="Whiteboard App" />
        <meta property="og:description" content="Collaborate on a whiteboard in real-time" />
      </Head> */}
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <RecoilRoot>
          <header className="bg-blue-600 text-white py-2 px-8 flex justify-between items-center shadow-md">
            <button onClick={() => router.push(`/`)}
            >
              My Whiteboard App
            </button>
            {/* <UserAvatar /> */}
            <Logout />
          </header>
          <main className="flex-grow container mx-auto p-2">{children}</main>
          <footer className="bg-gray-800 text-white text-center py-4">
            © 2024 Whiteboard Inc.
          </footer>
        </RecoilRoot>
      </body>
    </html>
  );
}
