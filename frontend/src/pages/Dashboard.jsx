import { useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import AlertBanner from "../components/AlertBanner";
import UploadPanel from "../components/UploadPanel";
import ImageGrid from "../components/ImageGrid";
import AuditLog from "../components/AuditLog";

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [auditRefresh, setAuditRefresh] = useState(0);
  const { lastMessage, connected } = useWebSocket("ws://localhost:8000/api/v1/ws/alerts");

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type === "ALERT") {
      setActiveAlert({ ...lastMessage, risk_level: "HIGH" });
    }
  }, [lastMessage]);

  const handleResult = (data) => {
    setResults((prev) => [...prev, data]);
    setAuditRefresh((n) => n + 1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AlertBanner alert={activeAlert} onDismiss={() => setActiveAlert(null)} />
      <header className="border-b border-slate-700 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SafeScan Dashboard</h1>
          <p className="text-slate-400 text-sm">PHSA · Real-Time Melanoma Triage</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-green-400" : "bg-red-500"}`} />
          <span className="text-slate-400 text-sm">{connected ? "Live" : "Disconnected"}</span>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          <UploadPanel onResult={handleResult} />
          <div className="bg-slate-800 rounded-xl p-5">
            <h3 className="text-slate-400 text-xs uppercase tracking-wider mb-3">Session Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-white">{results.length}</p>
                <p className="text-slate-400 text-xs">Total Scans</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-400">{results.filter(r => r.risk_level === "HIGH").length}</p>
                <p className="text-slate-400 text-xs">High Risk</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <h2 className="text-slate-300 font-semibold mb-4">
            Scan History
            <span className="ml-2 text-slate-500 text-sm font-normal">{results.length} processed</span>
          </h2>
          <ImageGrid results={results} />
        </div>
      </main>
      <section className="max-w-7xl mx-auto px-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-300 font-semibold">
            Audit Log
            <span className="ml-2 text-slate-500 text-sm font-normal">persisted · auto-refreshes every 10s</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">model v1.0.0</span>
        </div>
        <AuditLog key={auditRefresh} />
      </section>
    </div>
  );
}