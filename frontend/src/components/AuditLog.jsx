import { useEffect, useState } from "react";
import axios from "axios";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/audit");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch audit log:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and every 10 seconds
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-slate-500 text-sm">Loading audit log...</p>;
  if (logs.length === 0) return <p className="text-slate-500 text-sm">No entries yet.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-800 text-slate-400 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Filename</th>
            <th className="px-4 py-3">Confidence</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3">Age</th>
            <th className="px-4 py-3">Sex</th>
            <th className="px-4 py-3">Site</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {logs.map((log) => (
            <tr key={log.image_id} className={`transition-colors ${log.risk_level === "HIGH" ? "bg-red-950 hover:bg-red-900" : "bg-slate-900 hover:bg-slate-800"}`}>
              <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-white font-medium">{log.filename}</td>
              <td className="px-4 py-3 text-white">{(log.confidence * 100).toFixed(1)}%</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${log.risk_level === "HIGH" ? "bg-red-600 text-white" : "bg-green-800 text-green-200"}`}>
                  {log.risk_level}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300">{log.action_taken}</td>
              <td className="px-4 py-3 text-slate-400">{log.model_version}</td>
              <td className="px-4 py-3 text-slate-400">{log.age}</td>
              <td className="px-4 py-3 text-slate-400">{log.sex}</td>
              <td className="px-4 py-3 text-slate-400">{log.site}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
