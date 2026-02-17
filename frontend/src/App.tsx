import Home from "./pages/Home";
import { connectSocket, disconnectSocket } from "./socket/socket";
import { useEffect } from "react";
import { registerChatSocketEvents } from "./features/chat/chatSocket";
import { useAppSelector } from "./store/hooks";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },

    {
        path: "/login",
        element: <LoginPage/>,
    },

    {
        path: "/signup",
        element: <SignupPage/>,
    },


])


function App() {
    const { accessToken, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!accessToken || !user) return;

        const socket = connectSocket(accessToken, user._id);
        console.log("🟢 SOCKET CONNECTED", socket.id);
        registerChatSocketEvents(socket);

        return () => {
            disconnectSocket();
        };
    }, [accessToken, user]);

    

    return (
        <>
            <div className="p-4 h-screen flex items-center justify-center">
                <RouterProvider router={router}/>
            </div>
        </>
    );
}

export default App;
