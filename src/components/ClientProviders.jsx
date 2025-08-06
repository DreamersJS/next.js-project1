'use client';

import { RecoilRoot } from "recoil";
import { SocketProvider } from "@/context/SocketProvider";
import LayoutContent from "@/components/LayoutContent";

export default function ClientProviders({ children }) {
  return (
    <RecoilRoot>
      <SocketProvider>
        <LayoutContent>{children}</LayoutContent>
      </SocketProvider>
    </RecoilRoot>
  );
}
