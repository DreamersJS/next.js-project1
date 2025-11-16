"use client";
import React from 'react';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';

const UserAvatar = React.memo(() => {

  const { user } = useUser();

  if (!user || !user.uid) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Image
        src={user?.avatar || '/default.webp'}
        alt={`${user?.username || 'User'}'s avatar`}
        width={30}
        height={30}
        className="rounded-full"
        unoptimized
      />
      <span>{user?.username}</span>
    </div>
  );
});
UserAvatar.displayName = "UserAvatar";
export default UserAvatar;
