export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null;
  const isHigh = alert.type === "ALERT";
  return (
    <div className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 text-white font-bold text-lg shadow-lg ${isHigh ? "bg-red-600 animate-pulse" : "bg-green-700"}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{isHigh ? "??" : "??"}</span>
        <span>{isHigh ? `URGENT REVIEW — ${alert.filename} (${(alert.confidence * 100).toFixed(1)}% confidence)` : `Routine — ${alert.filename} cleared`}</span>
      </div>
      <button onClick={onDismiss} className="text-white text-xl hover:opacity-70">?</button>
    </div>
  );
}
