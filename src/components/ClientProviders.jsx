'use client';

import { RecoilRoot } from "recoil";
import LayoutContent from "@/components/LayoutContent";

export default function ClientProviders({ children }) {
  return (
    <RecoilRoot>
      <LayoutContent>{children}</LayoutContent>
    </RecoilRoot>
  );
}
