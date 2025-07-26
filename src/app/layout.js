// app/layout.js
"use client";
import "@/app/globals.css";
import Head from 'next/head';
import { RecoilRoot } from "recoil";
import Logout from "@/components/Logout";
import  UserAvatar  from "@/components/UserAvatar";
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userState } from "@/recoil/atoms/userAtom";

 function LayoutContent({ children }) {
  const router = useRouter();
  const user = useRecoilValue(userState);

  return (
    <html lang="en" className="h-full">
      <Head>
      <title>Collaborative Whiteboard Application - Real-time Drawing & Collaboration</title>
        <meta name="description" content="Experience seamless real-time collaboration with our Collaborative Whiteboard Application. Built using Next.js and Socket.IO, it allows users to draw and interact live on a shared whiteboard." />
        <meta property="og:title" content="Collaborative Whiteboard Application - Real-time Drawing & Collaboration" />
        <meta property="og:description" content="Collaborate in real-time with our online whiteboard app. Powered by Next.js and Socket.IO, this app offers a seamless drawing experience with real-time updates and user authentication." />
        <meta property="og:url" content="https://yourappdomain.com" /> 
        <meta property="og:site_name" content="Whiteboard Project" />
        <meta property="og:image" content="https://via.placeholder.com/1200x630" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Collaborative Whiteboard Application - Real-time Drawing & Collaboration" />
        <meta name="twitter:description" content="Collaborate in real-time on a shared virtual whiteboard. Built with Next.js and Socket.IO, offering live updates and secure user authentication." />
        <meta name="twitter:image" content="https://via.placeholder.com/1200x630" />
        <meta name="keywords" content="Collaborative Whiteboard, Real-time Drawing, Next.js, Socket.IO, Online Whiteboard App, User Authentication" />
        <meta name="author" content="Zvezda Neycheva" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className="bg-gray-100 min-h-screen flex flex-col">
          <header className="bg-blue-600 text-white py-2 px-8 flex justify-between items-center shadow-md">
            <button onClick={() => router.push(`/`)}
            >
              My Whiteboard App
            </button>
            {user?.uid && <UserAvatar />} 
            {user?.uid && <Logout />}
          </header>
          <main className="flex-grow container mx-auto p-2">{children}</main>
          <footer className="bg-gray-800 text-white text-center py-2">
            © 2024 Whiteboard Inc.
          </footer>
      </body>
    </html>
  );
}
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <RecoilRoot>
        <LayoutContent>{children}</LayoutContent>
      </RecoilRoot>
    </html>
  );
}