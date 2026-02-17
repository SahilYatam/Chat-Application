import type React from "react";

export type TabType = "global" | "friends";

interface UserFilterTabsProps {
    activeTab: TabType;
    setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}

const UserFilterTabs: React.FC<UserFilterTabsProps> = ({
    activeTab,
    setActiveTab,
}) => {
    return (
        <div className="flex gap-2 mt-3">
            <button
                onClick={() => setActiveTab("global")}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${activeTab === "global"
                        ? "bg-sky-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
            >
                Global Users
            </button>

            <button
                onClick={() => setActiveTab("friends")}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${activeTab === "friends"
                        ? "bg-sky-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
            >
                Friends
            </button>
        </div>
    );
};

export default UserFilterTabs;
