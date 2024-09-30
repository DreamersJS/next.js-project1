"use client"
import {logoutUser} from '@/lib/auth'
import {useRouter} from 'next/navigation'

export default function Logout() {
    const router = useRouter()
    
    const handleLogout = async () => {
        await logoutUser()
        router.push('/')
    }
    
    return (
        <button onClick={handleLogout}>Logout</button>
    )
}