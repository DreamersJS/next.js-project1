// app/(auth)/register/page.jsx
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserProfile, loginUser, registerUser, saveUserToCookie } from "@/services/auth";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const credentials = await registerUser(email, password);
      const uid = credentials.user.uid;
      const avatarUrl = '/default.png';
      const userObject = {
        uid: credentials.user.uid,
        email: credentials.user.email,
        username,
        avatar: avatarUrl,
        listOfWhiteboardIds: [],
        role: 'registered',
      };
      await createUserProfile(
        credentials.user.uid,
        username,
        credentials.user.email,
        avatarUrl,
        'registered',
        {}, // key-value pairs (id:true)
      );

      // Auto-login the user
      const loggedInUser = await loginUser(email, password);
      const userData = {
        uid: loggedInUser.uid,
        email: loggedInUser.email,
        username,
        avatar: avatarUrl,
        listOfWhiteboardIds: [],
        role: 'registered',
      };

      // Set user in global state and cookie
      setUser(userData);
      saveUserToCookie(userObject);
      if (credentials) {
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="border p-2"
        />
        <button type="submit" className="bg-blue-700 text-white p-2" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default RegisterPage;
