// layout.js
import "./globals.css";

import DrawingTools from "@/components/DrawingTools";
import Chat from "@/components/Chat";


export const metadata = {
  title: "Create Whiteboard App",
  description: "The Online Whiteboard with Real-Time Collaboration project is a fantastic way for users to draw and collaborate in real-time. Multiple users should be able to draw on the board simultaneously, with freehand drawing (pen, pencil), shapes (rectangle, circle, lines). Users can select different colors and brush sizes for drawing. The app should also have an eraser tool to erase the drawings. The app should have a chat feature where users can chat with each other while drawing. The app should have a feature to clear the board. The app should have a feature to undo the last action.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen bg-gray-100 ">
        <div className="flex h-full">

          {/* Main Content - Whiteboard */}
          <main className="bg-white p-6 flex-grow flex items-center justify-center">
            {children} {/* Render whiteboard content here */}
          </main>

          {/* Right Rail - Chat */}
          <aside className="bg-gray-200 p-4 border-l border-gray-300 flex-shrink-0 w-44">
            <Chat />
          </aside>
        </div>
      </body>
    </html>
  );
}
