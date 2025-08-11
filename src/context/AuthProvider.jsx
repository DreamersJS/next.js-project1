"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";
import { initFirebase } from '@/services/firebase';

let auth;
let hasAuthListener = false;

async function getFirebaseServices() {
  if (!auth) {
    const services = await initFirebase();
    auth = services.auth;
  }
  return { auth };
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  useEffect(() => {
    if (hasAuthListener) return;

    (async () => {
      const { auth } = await getFirebaseServices();
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setAuthUser(firebaseUser);
        } else {
          setAuthUser(null);
          setUser(null);
          router.push("/login");
        }
      });
      hasAuthListener = true;
    })();
  }, [router, setUser]);

  return (
    <AuthContext.Provider value={{ authUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
