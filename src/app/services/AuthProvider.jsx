// components/AuthProvider.jsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilState } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useRecoilState(userState); 
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setAuthUser(firebaseUser); // Only manage authUser locally
      } else {
        setUser(null); // Clear Recoil user state when the user logs out
        const targetPath = redirectPath ? `/login?redirect=${redirectPath}` : "/login";
        router.push(targetPath);
      }
    });
    return () => unsubscribe();
  }, [redirectPath, router, setUser]);

  return (
    <AuthContext.Provider value={{ authUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
