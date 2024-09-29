"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, loginAsGuest } from "@/lib/auth";
import { useSetRecoilState } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setUser = useSetRecoilState(userState);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      // Update the user state in Recoil
      setUser({
        uid: user.uid,
        email: user.email,
        username: user.username || "Unknown",
        avatar: user.avatar || null,
        listOfWhiteboardIds: user.listOfWhiteboardIds || [],
      });
        router.push("/");
    }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const user = await loginAsGuest();
      console.log('Logged in as guest:', user);
      setUser({
        uid: user.uid,
        email: null,
        username: user.username,
        avatar: user.avatar,
        listOfWhiteboardIds: user.listOfWhiteboardIds,
      });
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleLogin} className="space-y-4">
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
        <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
      </form>
      <br />or<br />
      <button onClick={handleGuestLogin} className="bg-green-500 text-white p-2 mt-4">
        Login as Guest
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <br />or<br />
      <button onClick={() => router.push("/register")} className="text-blue-500 underline">
        Register
      </button>
    </div>
  );
};

export default LoginPage;
