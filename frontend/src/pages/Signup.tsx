import { useNavigate, Link } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";
import { clearError } from "../features/auth/authSlices";
import { authThunks } from "../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect } from "react";
import type { SignupCredentials } from "../types";

export const SignupPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {user, status, error} = useAppSelector((state) => (state.auth));

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

    const handleSignup = async(formData: SignupCredentials) => {
        await dispatch(authThunks.signupUser(formData));
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">
                    Create Account ✨
                </h1>

                <SignupForm onSubmit={handleSignup} loading={status === "loading"} />

                <p className="text-sm text-gray-400 text-center mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-400 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )

}