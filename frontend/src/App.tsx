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
        user,
        accessToken,
        status: authStatus,
    } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (authStatus === "idle") {
            console.log("📥 Fetching user profile...");
            dispatch(userThunks.getUserProfile());
        }
    }, [authStatus, dispatch]);

    // Socket setup
    useEffect(() => {
        if (!user || !accessToken) return;

        const socket = connectSocket(user.userId, accessToken);

        socket.on("connect", () => {
            console.log("🟢 SOCKET CONNECTED", socket.id);
            registerChatSocketEvents(socket);
            registerNotificationSocket(socket, dispatch);
            dispatch(setSocketReady());
        });

        socket.on("connect_error", (err) => {
            console.log("🔴 SOCKET CONNECTION ERROR:", err.message);
        });

        socket.on("disconnect", (reason) => {
            console.log("🔴 SOCKET DISCONNECTED:", reason);
        });
    }, [user, accessToken, dispatch]);

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
