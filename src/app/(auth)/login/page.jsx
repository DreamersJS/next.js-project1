"use client";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const setUser = useSetRecoilState(userState);

  const handleRedirect = useCallback(() => {
    if (redirectPath && redirectPath !== router.asPath) {
      router.push(redirectPath);
    } else {
      router.push("/");
    }
  }, [redirectPath, router]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // import services dynamically - cuts initial bundle size—auth code loads only on interaction. Better Lighthouse score
      const { loginUser, getUserByUid, saveUserToCookie } = await import('@/services/auth');
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

      handleRedirect();
    } catch (error) {
      console.error(error);
      setError(error?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, redirectPath, router, setUser]);

  const handleGuestLogin = useCallback(async () => {
    setIsGuestLoading(true);
    try {
      const { loginAsGuest } = await import('@/services/auth');
      const user = await loginAsGuest();
      setUser({
        uid: user.uid,
        email: null,
        username: user.username,
        avatar: user.avatar,
        listOfWhiteboardIds: null,
        role: user.role || "guest",
      });

      handleRedirect();
    } catch (error) {
      console.error(error);
      setError(error?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsGuestLoading(false);
    }
  }, [redirectPath, router, setUser, handleRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">or</div>

        <button
          onClick={handleGuestLogin}
          disabled={isGuestLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGuestLoading ? "Loading..." : "Login as Guest"}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-4 text-sm">{error}</p>
        )}

        <div className="mt-6 text-center text-gray-700">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
