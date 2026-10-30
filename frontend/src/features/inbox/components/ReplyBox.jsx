
export default function ReplyBox({ platform, reply, setReply, onSend }) {
  return (
    <form
      onSubmit={onSend}
      className="border-t border-slate-200 bg-white p-6"
    >

      
      <textarea
        value={reply}
        onChange={(event) => setReply(event.target.value)}
        placeholder={`Write a ${platform} reply...`}
        rows="3"
        className="w-full resize-none rounded-xl border border-slate-100 p-4 text-sm outline-none focus:border-indigo-400"
      />

      <div className="mt-3 flex items-center justify-between">
        

        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Send reply ↗
        </button>
      </div>
    </form>
  );
}
