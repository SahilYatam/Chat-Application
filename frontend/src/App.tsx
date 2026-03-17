import Home from "./pages/Home";
import { connectSocket } from "./socket/socket";
import { useEffect } from "react";
import { registerChatSocketEvents } from "./features/chat/chatSocket";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { setSocketReady } from "./features/auth/authSlices";
import { userThunks } from "./features/user/userThunks";
import { registerNotificationSocket } from "./socket/notification.socket";

function RootLayout() {
    const dispatch = useAppDispatch();
    const {
        user: authUser,
        accessToken,
    } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!authUser && !accessToken) {
            console.log("📥 Fetching user profile on page refresh...");
            dispatch(userThunks.getUserProfile());
        }
    }, []);

    // Socket setup
    useEffect(() => {
        if (!authUser || !accessToken) return;

        const socket = connectSocket(authUser.id, accessToken);

        const handleConnect = () => {
            console.log("🟢 SOCKET CONNECTED", socket.id);
            registerChatSocketEvents(socket);
            registerNotificationSocket(socket, dispatch);
            dispatch(setSocketReady());
        };

        const handleDisconnect = (reason: string) => {
            console.log("🔴 SOCKET DISCONNECTED:", reason);
        };

        const handleError = (err: Error) => {
            console.log("🔴 SOCKET CONNECTION ERROR:", err.message);
        };

        const handleReconnect = () => {
            console.log("🔄 SOCKET RECONNECTED");
            registerChatSocketEvents(socket);
            registerNotificationSocket(socket, dispatch);
            dispatch(setSocketReady());
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleError);
        socket.on("reconnect", handleReconnect);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleError);
            socket.off("reconnect", handleReconnect);
        };
    }, [authUser, accessToken, dispatch]);

    return <Outlet />;
}

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/signup", element: <SignupPage /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
