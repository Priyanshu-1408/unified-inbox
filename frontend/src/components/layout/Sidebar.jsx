
const navigation = [
  { name: 'All messages', icon: '▤' },
  { name: 'Unread', icon: '●' },
  { name: 'Starred', icon: '☆' },
];

export default function Sidebar({
  active,
  setActive,
  filter,
  setFilter,
  messageCount,
}) {
  return (//aside HTML ka semantic element hai. Iska use main content se related side content, jaise sidebar, ke liye hota ha
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
          ✉
        </div>
        <div>
          <h1 className="text-lg font-bold">Unified Inbox</h1>
          <p className="text-xs text-slate-500">One place for everything</p>
        </div>
      </div>

      <button
        onClick={() => setActive('Inbox')}
        className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
          active === 'Inbox'
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <span>▣</span> Inbox
        <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-xs">
          {messageCount}
        </span>
      </button>

      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Mailboxes
      </p>

      <button
        onClick={() => setActive('Gmail')}
        className={`mb-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${
          active === 'Gmail'
            ? 'bg-red-50 font-semibold text-red-700'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 font-bold text-red-600">
          G
        </span>
        Gmail
      </button>

      <button
        onClick={() => setActive('Slack')}
        className={`mb-7 flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${
          active === 'Slack'
            ? 'bg-purple-50 font-semibold text-purple-700'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 font-bold text-purple-600">
          S
        </span>
        Slack
      </button>

      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Views
      </p>

      {navigation.map((item) => (
        <button
          key={item.name}
          onClick={() => setFilter(item.name)}
          className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm ${
            filter === item.name
              ? 'bg-slate-100 font-semibold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>{item.icon}</span>
          {item.name}
        </button>
      ))}

      <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-1 text-sm font-semibold">Integrations</p>
        <p className="mb-3 text-xs text-slate-500">
          Connect your favourite tools.
        </p>
        <div className="mb-2 flex items-center justify-between text-sm">
          Gmail <span className="text-emerald-600">● Ready</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          Slack <span className="text-emerald-600">● Ready</span>
        </div>
      </div>
    </aside>
  );
}

