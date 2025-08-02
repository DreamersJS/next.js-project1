// components/UserAvatar.jsx
"use client";
import React from 'react';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";
import Image from 'next/image';

const UserAvatar = () => {

  const user = useRecoilValue(userState);

  if (!user || !user.uid) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Image
        src={user?.avatar}
        alt={`${user?.username}'s avatar`}
        width={10}
        height={10}
        className="rounded-full"
      />
      <span>{user?.username}</span>
    </div>
  );
};

export default UserAvatar;
