
export default function MessageView({ message, onToggleStar }) {
  if (!message) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-400">
        Select a message to view the conversation.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
        <div>
          <span className={`rounded-md px-2 py-1 text-xs ${message.color}`}>
            {message.platform}
          </span>
          <h3 className="mt-3 text-xl font-bold">{message.subject}</h3>
        </div>

        <button
          onClick={() => onToggleStar(message.id)}
          className="text-2xl text-amber-500"
          aria-label="Toggle star"
        >
          {message.starred ? '★' : '☆'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full font-bold ${message.color}`}
            >
              {message.sender.charAt(0)}
            </div>

            <div>
              <p className="font-semibold">{message.sender}</p>
              <p className="text-xs text-slate-500">{message.email}</p>
            </div>

            <span className="ml-auto text-xs text-slate-400">
              {message.time}
            </span>
          </div>

          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {message.text}
          </p>
        </div>
      </div>
    </>
  );
}
