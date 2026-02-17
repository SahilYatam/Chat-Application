import {getSocket} from "../../socket/socket"

export const sendMessage = (payload: string) => {
    getSocket()?.emit("chat:message", payload)
}