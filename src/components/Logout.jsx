"use client";
import { logoutUser } from '@/app/services/auth'; // Ensure this is working correctly
import { useRouter } from 'next/navigation';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { userState } from "@/recoil/atoms/userAtom";

export default function Logout() {
    const router = useRouter();
    const resetUser = useResetRecoilState(userState);

    const handleLogout = async () => {
        try {
            await logoutUser();  
            resetUser();  // Resets userState to its default value

            // Use replace to ensure the transition happens smoothly
            router.replace('/'); 
        } catch (error) {
            console.error("Logout failed: ", error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}
