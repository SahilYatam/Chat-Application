import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Home = () => {
    const { user, isAuthenticated, status } = useAppSelector(
        (state) => state.auth,
    );

    console.log(
        "🏠 Home render — user:",
        user,
        "isAuthenticated:",
        isAuthenticated,
        "status:",
        status,
    );

    if (status === "loading" ) {
        return <AiOutlineLoading3Quarters/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="h-screen flex items-center justify-center">
            <div className="relative flex flex-col sm:h-[450px] md:h-[650px] rounded-lg overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10">
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
