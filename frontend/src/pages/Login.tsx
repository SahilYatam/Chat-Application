import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { clearError } from "../features/auth/authSlices";
import { authThunks } from "../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect } from "react";
import type { LoginCredentials } from "../types";

export const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { user, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!error) return;

        const timer = setTimeout(() => {
            dispatch(clearError());
        }, 3000);

        return () => clearTimeout(timer);
    }, [error, dispatch]);

    const handleLogin = async (formData: LoginCredentials) => {
        await dispatch(authThunks.loginUser(formData));
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">
                    Welcome Back 👋
                </h1>

                <LoginForm onSubmit={handleLogin} loading={false} />

                <p className="text-sm text-white text-center mt-6">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-700 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
