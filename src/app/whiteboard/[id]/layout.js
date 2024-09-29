// whiteboard/[id]/layout.js
import Chat from "@/components/Chat";
import { AuthProvider } from "@/components/AuthProvider";

export default function WhiteboardLayout({ children }) {
  return (
    <div className="flex m-1 p-0 h-full overflow-hidden absolute">

      {/* Main Content - Whiteboard */}
      <main className="flex-grow bg-white p-0 flex items-center justify-center">
        <AuthProvider>
          {children}
        </AuthProvider>
      </main>

      {/* Right Rail - Chat */}
      <aside className=" bg-gray-200 p-2 mx-2 top-0 right-0 border-l border-gray-300 w-56 flex-shrink-0">
        <Chat />
      </aside>
    </div>

  );
}
