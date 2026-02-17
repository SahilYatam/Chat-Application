import { useEffect } from "react";
import { getSocket } from "../socket/socket";
import { useAppDispatch } from "../store/hooks";
import { registerNotificationSocket } from "./notification.socket";

export const SocketBootstrap = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const socket = getSocket();

        registerNotificationSocket(socket, dispatch);

        return () => {
            socket.off("notification:new");
        };
    }, [dispatch]);

    return null;
};
