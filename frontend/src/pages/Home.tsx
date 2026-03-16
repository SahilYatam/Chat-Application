import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Home = () => {
    const { isAuthenticated, status } = useAppSelector(
        (state) => state.auth,
    );

    if (status === "loading") {
        return <AiOutlineLoading3Quarters />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="h-screen flex items-center justify-center p-4">
            <div className="relative flex flex-col w-full max-w-7xl h-[85vh] rounded-lg overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10">
                <Topbar />

                <div className="flex flex-1 min-h-0">
                    <Sidebar />
                    <MessageContainer />
                </div>
            </div>
        </main>
    );
};
export default Home;
