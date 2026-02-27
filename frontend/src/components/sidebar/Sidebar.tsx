import Conversations from "./Conversations";
import LogOutButton from "./LogoutBtn";
import SearchInput from "./SearchInput";
import type { TabType } from "./UserFilterTabs";
import UserFilterTabs from "./UserFilterTabs";
import { useState } from "react";

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState<TabType>("global");
    return (
        <div className="flex flex-col w-96 h-full border-r border-slate-700 bg-gray-900/40 backdrop-blur-md p-4">
            <SearchInput />

            <UserFilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="border-t border-slate-700 my-4"></div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <Conversations />
            </div>

            <LogOutButton />
        </div>
    );
};

export default Sidebar;
