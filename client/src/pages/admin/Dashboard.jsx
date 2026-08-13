import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {stats && (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Candidates" value={stats.totalCandidates} />
          <StatCard label="Recruiters" value={stats.totalRecruiters} />
          <StatCard label="Total Jobs" value={stats.totalJobs} />
          <StatCard label="Open Jobs" value={stats.openJobs} />
          <StatCard label="Applications" value={stats.totalApplications} />
        </div>
      )}

      <div className="flex gap-4">
        <Link to="/admin/users" className="text-brand-600 text-sm font-medium">Manage Users →</Link>
        <Link to="/admin/jobs" className="text-brand-600 text-sm font-medium">Manage Jobs →</Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
