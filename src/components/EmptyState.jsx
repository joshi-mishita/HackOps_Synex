export default function EmptyState({
    title = "No data available",
    description = "Connect a bank or add transactions to see insights here.",
    actionLabel,
    onAction,
  }) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-sky-50">{title}</h3>
        <p className="mt-2 text-sky-200">{description}</p>
  
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-6 px-6 py-3 rounded-xl bg-sky-300 text-slate-900 font-semibold hover:bg-sky-200 transition"
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }
  