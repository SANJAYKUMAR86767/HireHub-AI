import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      const dest = user.role === "recruiter" ? "/recruiter/dashboard"
        : user.role === "admin" ? "/admin/dashboard"
        : "/candidate/dashboard";
      navigate(dest);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold mb-6">Log in to HireHub</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email" required placeholder="Email"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password" required placeholder="Password"
          className="w-full border rounded-md px-3 py-2 text-sm"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-brand-600 text-white py-2 rounded-md text-sm">Log in</button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        No account? <Link to="/register" className="text-brand-600">Sign up</Link>
      </p>
    </div>
  );
}
