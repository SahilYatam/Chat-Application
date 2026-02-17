import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Input, Button } from "../shared/index";
import { Eye, EyeOff } from "lucide-react";
import GenderCheckbox from "./GenderCheckBox";

interface SignupFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    gender: string;
}

interface SignupFormProps {
    onSubmit: (data: SignupFormData) => void;
    loading?: boolean;
}

interface FormErrors {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    gender?: string;
}

const SignupForm = ({ onSubmit, loading = false }: SignupFormProps) => {
    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [gender, setGender] = useState<"male" | "female" | "">("");
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = ({
        name,
        email,
        password,
        gender
    }: SignupFormData): FormErrors => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = "name is required";
        }
        
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        if (!gender) {
            newErrors.gender = "Please select your gender";
        }

        return newErrors;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErros = validateForm({
            name,
            username,
            email,
            password,
            gender,
        });
        setErrors(validationErros);

        if (Object.keys(validationErros).length === 0 && gender !== "") {
            onSubmit({ name, username, email, password, gender });
        }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
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

    const handleGenderChange = (selected: "male" | "female") => {
        setGender(selected);
        if (errors.gender) {
            setErrors((prev) => ({ ...prev, gender: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                type="text"
                label="Name"
                value={name}
                onChange={handleNameChange}
                placeholder="John Doe"
                error={errors.name}
                required
            />

            <Input
                type="text"
                label="Username"
                value={username}
                onChange={handleUsernameChange}
                placeholder="John Doe"
                error={errors.name}
                required
            />

            <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                error={errors.email}
                required
            />

            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    error={errors.password}
                    required
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-11 text-gray-400 hover:text-gray-300 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <GenderCheckbox
                selectedGender={gender}
                onCheckboxChange={handleGenderChange}
            />
            {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sign in..." : "Signup"}
            </Button>
        </form>
    );
};

export default SignupForm;
