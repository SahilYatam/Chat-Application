import {getSocket} from "../../socket/socket"

interface SendMessagePayload {
    conversationId: string;
    message: string;
}


export const sendMessage = (payload: SendMessagePayload) => {
    getSocket()?.emit("chat:message", payload)
}