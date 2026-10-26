
import MessageItem from './MessageItem.jsx';

export default function MessageList({
  messages,
  selected,
  onSelect,
  onToggleStar,
}) {
  return (
    <section className="border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h3 className="font-semibold">Messages</h3>
        <span className="text-xs text-slate-500">
          {messages.length} conversations
        </span>
      </div>

      {messages.length ? (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            selected={selected}
            onSelect={onSelect}
            onToggleStar={onToggleStar}
          />
        ))
      ) : (
        <p className="p-6 text-sm text-slate-500">No messages found.</p>
      )}
    </section>
  );
}
