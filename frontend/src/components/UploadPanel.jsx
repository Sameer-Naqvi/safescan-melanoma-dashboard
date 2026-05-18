import { useState } from "react";
import axios from "axios";

export default function UploadPanel({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState(45);
  const [sex, setSex] = useState("unknown");
  const [site, setSite] = useState("unknown");

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("age", age);
    formData.append("sex", sex);
    formData.append("site", site);
    try {
      const res = await axios.post("http://localhost:8000/api/v1/predict", formData);
      onResult(res.data);
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 space-y-4">
      <h2 className="text-white text-xl font-semibold">Submit Scan</h2>
      <input type="file" accept="image/jpeg,image/png" onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-slate-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-slate-400 text-xs">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
            className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm mt-1" />
        </div>
        <div>
          <label className="text-slate-400 text-xs">Sex</label>
          <select value={sex} onChange={(e) => setSex(e.target.value)}
            className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm mt-1">
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="text-slate-400 text-xs">Site</label>
          <select value={site} onChange={(e) => setSite(e.target.value)}
            className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm mt-1">
            <option value="unknown">Unknown</option>
            <option value="torso">Torso</option>
            <option value="head/neck">Head/Neck</option>
            <option value="upper extremity">Upper Extremity</option>
            <option value="lower extremity">Lower Extremity</option>
            <option value="palms/soles">Palms/Soles</option>
            <option value="oral/genital">Oral/Genital</option>
          </select>
        </div>
      </div>
      <button onClick={handleSubmit} disabled={!file || loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold py-3 rounded-lg transition-colors">
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>
    </div>
  );
}
