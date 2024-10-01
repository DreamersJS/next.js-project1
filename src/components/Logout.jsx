"use client"
import {logoutUser} from '@/app/services/auth'
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