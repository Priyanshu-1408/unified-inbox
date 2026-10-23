
export default function Topbar({ active, search, setSearch }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h2 className="text-xl font-bold">{active}</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage all your conversations in one place.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search messages..."
          className="w-64 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
          U
        </div>
      </div>
    </header>
  );
}
