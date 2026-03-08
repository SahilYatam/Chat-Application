import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { chatThunk } from "../../features/chat/chatThunks";

const MessageInput = () => {
    const [message, setMessage] = useState("")
    const dispatch = useAppDispatch()

     const selectedUserId = useAppSelector(
        (state) => state.chat.selectedUserId
    );

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!message.trim() || !selectedUserId)  return;

        await dispatch(
            chatThunk.sendMessage({
                receiverId: selectedUserId,
                message: message
            })
        )

        setMessage("")
    }

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
				/>
				<button type='submit' className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white'>
					<BsSend />
				</button>
			</div>
		</form>
	);
};
export default MessageInput;
