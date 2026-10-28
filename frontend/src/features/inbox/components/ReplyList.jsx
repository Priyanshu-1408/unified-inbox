
export default function ReplyList({ replies }) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h4 className="mb-4 font-semibold">Replies</h4>

      {replies.length ? (
        replies.map((ite) => (  //item is used to represent the current element
          <p
            key={ite.id}  //key bis uswed for unique identity
            className="mb-3 rounded-xl bg-indigo-50 p-3 text-sm"
          >
            {ite.text}
            <span className="mt-1 block text-xs text-slate-400">
              Local demo reply
            </span>
          </p>
        ))
      ) : (
        <p className="text-sm text-slate-400">No replies yet.</p>
      )}
    </div>
  );
}
