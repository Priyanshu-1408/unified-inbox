
export default function MessageItem({ message, selected, onSelect, onToggleStar }) {
  return (
    <button
    
      onClick={() => onSelect(message)}
      className={`w-full border-b border-slate-100 p-5 text-left transition hover:bg-slate-50 ${
        selected?.id === message.id
          ? 'border-l-4 border-l-indigo-600 bg-indigo-50/50'
          : 'border-l-4 border-l-transparent'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${message.color}`}
        >
          {message.platform === 'Gmail' ? 'G' : '#'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{message.sender}</p>
            <span className="shrink-0 text-xs text-slate-400">
              {message.time}
            </span>
          </div>

          <p className="mt-1 truncate text-sm text-slate-700">
            {message.subject}
          </p>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
            {message.text}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className={`rounded-md px-2 py-1 text-xs ${message.color}`}>
              {message.platform}
            </span>

            <span
              onClick={(event) => {
                event.stopPropagation();
                onToggleStar(message.id);
              }}
              className="cursor-pointer text-lg text-amber-500"
            >
              {message.starred ? '★' : '☆'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}