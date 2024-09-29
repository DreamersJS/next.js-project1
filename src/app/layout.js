// app/layout.js
"use client";
import "@/app/globals.css";
import Head from 'next/head';
import { RecoilRoot } from "recoil";
import Logout  from "@/components/Logout";

export default function RootLayout({ children }) {
  return (
    <html>
      <Head>
        <title>Online Drawing Whiteboard App</title>
        <meta name="description" content="Collaborate on a whiteboard in real-time" />
        <meta property="og:title" content="Whiteboard App" />
        <meta property="og:description" content="Collaborate on a whiteboard in real-time" />
      </Head>
      <body>
        <RecoilRoot>
        <header
        className="bg-blue-600 text-white py-2 px-8 flex justify-between items-center shadow-md">
          My Whiteboard App <Logout/> 
          </header>
          <main className="container mx-auto p-4">{children}</main>
        <footer className="bg-gray-800 text-white text-center py-4 mt-8">© 2024 Whiteboard Inc.</footer>
        </RecoilRoot>
      </body>
    </html>
  );
}
