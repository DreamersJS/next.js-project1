// app/layout.js
"use client";
import "@/app/globals.css";
import Head from 'next/head';
import { RecoilRoot } from "recoil";
import Logout from "@/components/Logout";
import  UserAvatar  from "@/components/UserAvatar";
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <html lang="en" className="h-full">
      <Head>
        <title>Online Drawing Whiteboard App</title>
        <meta name="description" content="Collaborate on a whiteboard in real-time" />
        <meta property="og:title" content="Whiteboard App" />
        <meta property="og:description" content="Collaborate on a whiteboard in real-time" />
      </Head>
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <RecoilRoot>
          <header className="bg-blue-600 text-white py-2 px-8 flex justify-between items-center shadow-md">
            <button onClick={() => router.push(`/`)}
            >
              My Whiteboard App
            </button>
            <UserAvatar />
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
