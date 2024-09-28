// app/layout.js
import "@/app/globals.css";
import Head from 'next/head';

export default function RootLayout({ children }) {
  return (
    <html>
      <Head>
        <title>Online Drawing Whiteboard App</title>
        <meta name="description" content="Collaborate on a whiteboard in real-time" />
        <meta property="og:title" content="Whiteboard App" />
        <meta property="og:description" content="Collaborate on a whiteboard in real-time" />
        <meta property="og:image" content="/thumbnail.jpg" />
      </Head>
      <body>
        {/* <header>My Whiteboard App</header> */}
        <main>{children}</main>
        {/* <footer>© 2024 Whiteboard Inc.</footer> */}
      </body>
    </html>
  );
}
