import Home from "./pages/Home";
import { connectSocket, updateSocketToken } from "./socket/socket";
import { useEffect, useState } from "react";
import { registerChatSocketEvents } from "./features/chat/chatSocket";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { setSocketReady } from "./features/auth/authSlices";
import { userThunks } from "./features/user/userThunks";
import { registerNotificationSocket } from "./socket/notification.socket";
import { Loader2Icon } from "lucide-react"

function RootLayout() {
    const dispatch = useAppDispatch();
    const { user: authUser, accessToken } = useAppSelector((state) => state.auth);

    const [authInitialized, setAuthInitialized] = useState(!!(authUser || accessToken));

    useEffect(() => {
        if (authInitialized) return;

        dispatch(userThunks.getUserProfile()).finally(() => {
            setAuthInitialized(true)
        })

    }, []);

    // Socket setup
    useEffect(() => {
        if (!authInitialized || !authUser || !accessToken) return;

        const socket = connectSocket(authUser.id, accessToken);

        const handleConnect = () => {
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

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleError);
        socket.io.on("reconnect", () => {
            registerChatSocketEvents(socket);
            registerNotificationSocket(socket, dispatch);
            dispatch(setSocketReady());
        });

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleError);
            socket.off("reconnect");
        };
    }, [authUser, accessToken, dispatch]);

    useEffect(() => {
        if (!accessToken) return;
        updateSocketToken(accessToken);
    }, [accessToken]);

    if (!authInitialized) {
        return <Loader2Icon size={30} />
    }

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
