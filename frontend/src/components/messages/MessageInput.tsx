import { BsSend } from "react-icons/bs";

const MessageInput = () => {
	return (
		<form className='px-4 my-3'>
			<div className='w-full relative'>
				<input
					type='text'
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
