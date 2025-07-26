// components/UserAvatar.jsx
"use client";
import React from 'react';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";

const UserAvatar = () => {

  const user = useRecoilValue(userState);

  if (!user || !user.uid) {
    return null; 
  }

  return (
    <div className="flex items-center space-x-2">
      <img src={user?.avatar} alt="" className="w-10 h-10 rounded-full" />
      <span>{user?.username}</span>
    </div>
  );
};

export default UserAvatar;
