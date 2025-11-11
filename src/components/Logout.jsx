"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useResetRecoilState } from 'recoil';
import { userState } from "@/recoil/atoms/userAtom";

const Logout = React.memo(function LogoutComponent() {
    const router = useRouter();
    const resetUser = useResetRecoilState(userState);

    const handleLogout = async () => {
        const { logoutUser } = await import('@/services/auth');
        try {
            await logoutUser();
            resetUser();
            router.replace('/');
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
});
export default Logout;