"use client";
import "@/app/globals.css";
import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userState } from "@/recoil/atoms/userAtom";
const UserAvatar = dynamic(() => import('@/components/UserAvatar'), { ssr: false });
const Logout = dynamic(() => import('@/components/Logout'), { ssr: false });

function LayoutContent({ children }) {
  const router = useRouter();
  const user = useRecoilValue(userState);
  const { id: whiteboardId } = useParams();

  const navigateTo = useCallback((path) => {
    router.push(`/${path}`);
  }, [router]);

  return (
    <>
      {!whiteboardId &&
        <header className="bg-blue-700 text-white py-2 px-4 flex justify-between items-center shadow-md">
          <button onClick={() => navigateTo('')} aria-label="Go to home page">
            My Whiteboard App
          </button>
          {user?.uid && <UserAvatar />}
          {user?.uid && <Logout />}
        </header>
      }
      <main className="flex-grow container mx-auto p-1">
            {children}
      </main>
      {/* <footer className="bg-gray-800 text-white text-center py-2">
        © 2024 Whiteboard Inc.
      </footer> */}
    </>
  );
}
export default LayoutContent;