import React from "react";

interface AcceptOrRejectRequestProps {
    username: string | undefined;
    requestId: string;
    onAccept: (requestId: string) => void;
    onReject: (requestId: string) => void;
}

const AcceptOrRejectRequest: React.FC<AcceptOrRejectRequestProps> = ({
    username,
    requestId,
    onAccept,
    onReject,
}) => {
    return (
        <div className="flex items-center justify-center w-full h-full px-4">
            <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl p-8 text-center space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Friend Request</h2>
                    <p className="text-gray-300 text-sm">
                        <span className="font-semibold text-white">{username}</span> has
                        sent you a friend request.
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all duration-200 text-white font-semibold shadow-md cursor-pointer"
                        onClick={() => onAccept(requestId)}
                    >
                        Accept
                    </button>

                    <button
                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 transition-all duration-200 text-white font-semibold shadow-md cursor-pointer"
                        onClick={() => onReject(requestId)}
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AcceptOrRejectRequest;
