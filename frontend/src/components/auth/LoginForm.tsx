import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Input, Button } from "../shared/index";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    loading?: boolean;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const LoginForm = ({ onSubmit, loading = false }: LoginFormProps) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = ({ email, password }: LoginFormData): FormErrors => {
        const newErrors: FormErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateForm({ email, password });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            onSubmit({ email, password });
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errors.password)
            setErrors((prev) => ({ ...prev, password: undefined }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                error={errors.email}
            />

            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    error={errors.password}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-11 text-gray-400 hover:text-gray-300 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
            </Button>
        </form>
    );
};

export default LoginForm;