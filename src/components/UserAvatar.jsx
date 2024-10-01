// components/UserAvatar.jsx
"use client";
import React from 'react';
import { useRecoilValue } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";

const UserAvatar = () => {

  const user = useRecoilValue(userState);
  const username = user.username;
  const avatar = user.avatar;

  return (
    <div className="flex items-center space-x-2">
      <img src={avatar} className="w-10 h-10 rounded-full" />
      <span>{username}</span>
    </div>
  );
};

export default UserAvatar;
