import { LogOutIcon } from "lucide-react";

const LogOutButton = () => {
    return (
        <div className="mt-auto p-3">
            <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-500/20 transition-colors">
                <LogOutIcon className="w-5 h-5 text-gray-300 hover:text-red-500 transition-colors cursor-pointer" />
            </button>
        </div>
    )
}


export default LogOutButton;
