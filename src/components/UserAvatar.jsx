// components/UserAvatar.jsx
"use client";
import React from 'react';

const UserAvatar = ({ username, avatar }) => {
  const avatarUrl = `https://api.adorable.io/avatars/285/${username}.png`;

  return (
    <div className="flex items-center space-x-2">
      <img src={avatar || avatarUrl} alt={`${username} avatar`} className="w-10 h-10 rounded-full" />
      <span>{username}</span>
    </div>
  );
};

export default UserAvatar;
