import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = () => api.get("/admin/users").then((res) => setUsers(res.data));
  useEffect(() => { load(); }, []);

  const toggleBlock = async (id, blocked) => {
    await api.put(`/admin/users/${id}/block`, { blocked: !blocked });
    load();
  };

  const verify = async (id) => {
    await api.put(`/admin/recruiters/${id}/verify`);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="space-y-2">
        {users.map((u) => (
          <div key={u._id} className="border rounded-lg p-3 bg-white flex justify-between items-center">
            <div>
              <p className="font-medium">{u.name} <span className="text-xs text-gray-400">({u.role})</span></p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            <div className="flex gap-2 items-center">
              {u.role === "recruiter" && !u.companyVerified && (
                <button onClick={() => verify(u._id)} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
                  Verify Company
                </button>
              )}
              <button
                onClick={() => toggleBlock(u._id, u.blocked)}
                className={`text-xs px-2 py-1 rounded-full ${u.blocked ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"}`}
              >
                {u.blocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
