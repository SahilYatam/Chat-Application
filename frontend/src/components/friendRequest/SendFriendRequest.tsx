import React from "react";

interface SendFriendRequestProps {
    onSend: () => void;
}

const SendFriendRequest: React.FC<SendFriendRequestProps> = ({ onSend }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-semibold text-white mb-3">
                Send Friend Request
            </h2>

            <p className="text-white mb-6 p-3">
                You need to send a friend request before starting a conversation.
            </p>

            <button
                onClick={onSend}
                className="px-6 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 transition-colors text-white"
            >
                Send Request
            </button>
        </div>
    );
};

export default SendFriendRequest;
