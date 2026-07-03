import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button, Input } from "../components/shared";
import { clearError } from "../features/auth/authSlices";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { LoginCredentials } from "../types";

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const hasUser = useAppSelector((s) => !!s.auth.user);
  const status = useAppSelector((s) => s.auth.status);
  const error = useAppSelector((s) => s.auth.error);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => dispatch(clearError()), 3000);
    return () => clearTimeout(t);
  }, [error, dispatch]);

  if (isAuthenticated && hasUser) return <Navigate to="/" replace />;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!username.trim()) next.username = "Username is required";
    if (!password.trim()) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    const { authThunks } = await import("../features/auth/authThunks");
    await dispatch(authThunks.loginUser({ username, password } as LoginCredentials));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back 👋</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            label="Username"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((p) => ({ ...p, username: undefined }));
            }}
            placeholder="JohnDoe123"
            error={errors.username}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="Enter your password"
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-11 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-sm text-white text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-700 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
