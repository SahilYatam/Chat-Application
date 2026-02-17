

const RequestPending = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-lg font-semibold text-yellow-400 mb-2">
            Request Sent
        </h2>

        <p className="text-white p-3">
            waiting for the user to accept your friend request.
        </p>

    </div>
  )
}

export default RequestPending