// import { extractTime } from "../../utils/extractTime";

const Message = () => {
  const bubbleBgColor = "bg-blue-500";
  return (
    <div className={`chat`}>
      <div className="hidden md:block chat-image avatar">
        <div className="w-6 md:w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src="/bg.png" />
        </div>
      </div>
      <p
        className={`chat-bubble text-white ${bubbleBgColor} text-sm md:text-md`}
      >
        "Hi"
      </p>
      <span className="chat-footer opacity-50 text-xs flex gap-1 items-center text-white">
        "12:00"
      </span>
    </div>
  );
};

export default Message;
