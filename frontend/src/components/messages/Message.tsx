import { useAppSelector } from "../../store/hooks";
import { extractTime } from "../../utils/extractTime";

interface MessageFormat {
    message: string;
    createdAt: string;
    senderId: string;
}

const Message = ({ message, createdAt, senderId }: MessageFormat) => {
    const currentUserId = useAppSelector((state) => state.user.user?._id);

    const isSender =
    String(currentUserId) === String(senderId);

    console.log("currentUserId:", currentUserId);
    console.log("senderId:", senderId);
    console.log("equal?", currentUserId === senderId);

    return (
        <div
            className={`w-full flex p-2 mb-2 ${isSender ? "justify-end" : "justify-start"
                }`}
        >
            <div className="flex flex-col max-w-xs md:max-w-md">
                <div
                    className={`px-4 py-2 rounded-2xl text-sm md:text-base shadow-md ${isSender
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                >
                    {message}
                </div>

                <span
                    className={`text-xs mt-1 ${isSender ? "text-right text-gray-300" : "text-left text-gray-300"
                        }`}
                >
                    {extractTime(createdAt)}
                </span>
            </div>
        </div>
    );
};

export default Message;
