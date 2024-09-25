// app/layout.js
import "@/app/globals.css";

export default function RootLayout({ children }) {
    return (
      <html>
        <body>
          {/* <header>My Whiteboard App</header> */}
          <main>{children}</main>
          {/* <footer>© 2024 Whiteboard Inc.</footer> */}
        </body>
      </html>
    );
  }
  