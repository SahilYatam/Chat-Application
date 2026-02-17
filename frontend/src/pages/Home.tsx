import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";
import SendFriendRequest from "../components/friendRequest/SendFriendRequest";
import RequestPending from "../components/friendRequest/RequestPending";
import { useState } from "react";
import Topbar from "../components/layout/Topbar";

type RelationshipStatus = "none" | "pending" | "friends";

const Home = () => {
    const [status, setStatus] = useState<RelationshipStatus>("none");

    const onSend = () => {
        setStatus("pending");
    };

    return (
        <div className="relative flex flex-col sm:h-[450px] md:h-[650px] rounded-lg overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10">
            <Topbar />

            <div className="flex flex-1 min-h-0">
                <Sidebar />
                {status === "friends" && <MessageContainer />}
                {status === "none" && <SendFriendRequest onSend={onSend} />}
                {status === "pending" && <RequestPending />}
            </div>
        </div>
    );
};
export default Home;

// const Home = () => {
//     const [status, setStatus] = useState<RelationshipStatus>("none");

//     const onSend = () => {
//         setStatus("pending");
//     };

//     return (
//         <div className="flex flex-col h-screen">
//             <Topbar />

//             <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10">
//                 <Sidebar />
//                 {status === "friends" && <MessageContainer />}
//                 {status === "none" && <SendFriendRequest onSend={onSend} />}
//                 {status === "pending" && <RequestPending />}
//             </div>
//         </div>
//     );
// };
// export default Home;
