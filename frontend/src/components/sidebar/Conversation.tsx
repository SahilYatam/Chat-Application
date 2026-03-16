interface Prop {
    id: string;
    avatar: string;
    username: string;
    selectUser: (id: string) => void;
}

const Conversation = ({avatar, username, selectUser, id}: Prop) => {

	return (
		<>
			<div className='flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-sky-500/20 min-w-0' onClick={() => {
                selectUser(id);
            }}>
				
				<div className='relative'>
					<img
                        className="w-12 h-12 rounded-full outline outline-1 bg-white"
						src={avatar}
						alt='user avatar'
					/>
                    
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex items-center justify-between'>
						<p className='font-semibold text-gray-200'>
							{username}
						</p>
					</div>
				</div>
			</div>

			<div className='border-t border-gray-700 my-1'></div>
		</>
	);
};

export default Conversation;
