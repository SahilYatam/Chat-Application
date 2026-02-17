const Conversation = () => {
	return (
		<>
			<div className='flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-sky-500/20 min-w-0'>
				
				<div className='relative'>
					<img
						className='w-12 h-12 rounded-full object-cover'
						src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
						alt='user avatar'
					/>
					<span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full'></span>
				</div>

				<div className='flex flex-col flex-1'>
					<div className='flex items-center justify-between'>
						<p className='font-semibold text-gray-200'>
							John Doe
						</p>
					</div>
				</div>
			</div>

			<div className='border-t border-gray-700 my-1'></div>
		</>
	);
};

export default Conversation;
