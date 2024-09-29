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
        <header>My Whiteboard App <Logout/> </header>
          <main>{children}</main>
        {/* <footer>© 2024 Whiteboard Inc.</footer> */}
        </RecoilRoot>
      </body>
    </html>
  );
}
