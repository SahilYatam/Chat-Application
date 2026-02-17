import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Input, Button } from "../shared/index";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormData {
    username: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    loading?: boolean;
}

interface FormErrors {
    username?: string;
    password?: string;
}

const LoginForm = ({ onSubmit, loading = false }: LoginFormProps) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = ({ username, password }: LoginFormData): FormErrors => {
        const newErrors: FormErrors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateForm({ username, password });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            onSubmit({ username, password });
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        if (errors.username) setErrors((prev) => ({ ...prev, email: undefined }));
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errors.password)
            setErrors((prev) => ({ ...prev, password: undefined }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                type="text"
                label="Username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="JohnDoe123"
                error={errors.username}
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