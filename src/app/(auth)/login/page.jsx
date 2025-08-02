"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser, loginAsGuest, getUserByUid, saveUserToCookie } from "@/services/auth";
import { useSetRecoilState } from "recoil";
import { userState } from "@/recoil/atoms/userAtom";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect"); // Retrieve the 'redirect' query parameter
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useSetRecoilState(userState);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);

      // Set a short delay or confirm cookie is set
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData = await getUserByUid(user.uid);
      const arrayOfWhiteboardIds = userData?.listOfWhiteboardIds ? Object.keys(userData.listOfWhiteboardIds) : [];

      const userObject = {
        uid: user.uid,
        email: user.email,
        username: userData.username || "Unknown",
        avatar: userData.avatar || null,
        listOfWhiteboardIds: arrayOfWhiteboardIds || [],
        role: userData.role || "registered",
      };
      setUser(userObject);
      // Save user state in a cookie
      saveUserToCookie(userObject);

      // Redirect to the original path if available or to the home page
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push("/");
      }
    } catch (error) {
      setError(error?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const user = await loginAsGuest();
      setUser({
        uid: user.uid,
        email: null,
        username: user.username,
        avatar: user.avatar,
        listOfWhiteboardIds: null,
        role: user.role || "guest",
      });

      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.push("/");
      }
    } catch (error) {
      setError(error?.message || "An unexpected error occurred. Please try again.");
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
          autoComplete="email"
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 m-2" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'} {/* Disable and show loading text */}
        </button>
      </form>
      <br />or<br />
      <button onClick={handleGuestLogin} className="bg-green-500 text-white p-2 mt-4" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login as Guest'}
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
