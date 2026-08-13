import React, { useEffect, useState } from "react";
import api from "../../services/api";

const RISK_STYLES = {
  low: "bg-green-50 text-green-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

function RiskBadge({ level, score }) {
  const cls = RISK_STYLES[level] || RISK_STYLES.low;
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${cls}`}>
      {level === "high" ? "⚠ High risk" : level === "medium" ? "Medium risk" : "Low risk"} · {score}
    </span>
  );
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = () => api.get("/admin/jobs").then((res) => setJobs(res.data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await api.delete(`/admin/jobs/${id}`);
    load();
  };

  const visible = jobs.filter((j) => filter === "all" || j.riskLevel === filter);
  const highRiskCount = jobs.filter((j) => j.riskLevel === "high").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        {highRiskCount > 0 && (
          <span className="text-xs font-medium bg-red-50 text-red-700 px-3 py-1.5 rounded-full">
            {highRiskCount} flagged as high risk
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-4 text-xs">
        {["all", "low", "medium", "high"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full border capitalize ${
              filter === f ? "bg-brand-600 text-white border-brand-600" : "text-gray-600 border-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((j) => (
          <div key={j._id} className="border rounded-lg p-3 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{j.title}</p>
                <p className="text-sm text-gray-500">{j.company} · {j.recruiterId?.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={j.riskLevel} score={j.riskScore} />
                {j.riskFlags?.length > 0 && (
                  <button
                    onClick={() => setExpanded(expanded === j._id ? null : j._id)}
                    className="text-xs text-gray-500 underline"
                  >
                    {expanded === j._id ? "hide" : "details"}
                  </button>
                )}
                <button onClick={() => remove(j._id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                  Remove
                </button>
              </div>
            </div>
            {expanded === j._id && j.riskFlags?.length > 0 && (
              <ul className="mt-2 pl-4 text-xs text-gray-600 list-disc space-y-0.5">
                {j.riskFlags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            )}
          </div>
        ))}
        {visible.length === 0 && <p className="text-sm text-gray-500">No jobs in this category.</p>}
      </div>
    </div>
  );
}
