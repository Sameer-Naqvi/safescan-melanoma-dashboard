export default function ImageGrid({ results }) {
  if (results.length === 0) {
    return <div className="text-slate-500 text-center py-16">No scans processed yet. Upload an image to begin.</div>;
  }
  return (
    <div className="space-y-3">
      {[...results].reverse().map((r) => (
        <div key={r.image_id} className={`flex items-center justify-between rounded-lg px-5 py-4 border ${r.risk_level === "HIGH" ? "bg-red-950 border-red-600" : "bg-slate-800 border-slate-700"}`}>
          <div className="flex items-center gap-4">
            <span className="text-2xl">{r.risk_level === "HIGH" ? "??" : "??"}</span>
            <div>
              <p className="text-white font-medium text-sm">{r.filename}</p>
              <p className="text-slate-400 text-xs">{r.sex} · {r.site} · age {r.age}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-bold text-sm ${r.risk_level === "HIGH" ? "text-red-400" : "text-green-400"}`}>{r.risk_level}</p>
            <p className="text-slate-400 text-xs">{(r.confidence * 100).toFixed(1)}% confidence</p>
          </div>
        </div>
      ))}
    </div>
  );
}
