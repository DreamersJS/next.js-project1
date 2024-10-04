// app/(auth)/register/page.jsx
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "@/app/services/auth";
import { useSetRecoilState } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect"); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const setUser = useSetRecoilState(userState);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // await registerUser(email, password, username);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      console.log('response:', response);
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        console.log('User registered:', user);
        const arrayOfWhiteboardIds = Object.keys(user.listOfWhiteboardIds);
        setUser({
          uid: user.uid,
          email: user.email,
          username: user.username || "Unknown",
          avatar: user.avatar || null,
          listOfWhiteboardIds: arrayOfWhiteboardIds || [],
        });

        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/login");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Display Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default RegisterPage;
