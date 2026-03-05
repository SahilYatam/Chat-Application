import { LogOutIcon } from "lucide-react";
import { authThunks } from "../../features/auth/authThunks";
import { useAppDispatch } from "../../store/hooks";
import { useNavigate } from "react-router-dom";

const LogOutButton = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(authThunks.logoutUser()).unwrap();
        navigate("/login");
    };

    return (
        <div className="mt-auto p-3" onClick={handleLogout}>
            <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-500/20 transition-colors">
                <LogOutIcon className="w-5 h-5 text-gray-300 hover:text-red-500 transition-colors cursor-pointer" />
            </button>
        </div>
    );
};

export default LogOutButton;
