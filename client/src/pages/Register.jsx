import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate", companyName: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      navigate(user.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold mb-6">Create your HireHub account</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="flex gap-2 mb-2">
          <button type="button"
            onClick={() => setForm({ ...form, role: "candidate" })}
            className={`flex-1 py-2 rounded-md text-sm border ${form.role === "candidate" ? "bg-brand-600 text-white" : "bg-white text-gray-600"}`}
          >Candidate</button>
          <button type="button"
            onClick={() => setForm({ ...form, role: "recruiter" })}
            className={`flex-1 py-2 rounded-md text-sm border ${form.role === "recruiter" ? "bg-brand-600 text-white" : "bg-white text-gray-600"}`}
          >Recruiter</button>
        </div>
        <input required placeholder="Full name" className="w-full border rounded-md px-3 py-2 text-sm"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" className="w-full border rounded-md px-3 py-2 text-sm"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password (min 6 chars)" className="w-full border rounded-md px-3 py-2 text-sm"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {form.role === "recruiter" && (
          <input placeholder="Company name" className="w-full border rounded-md px-3 py-2 text-sm"
            value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-brand-600 text-white py-2 rounded-md text-sm">Sign up</button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Already have an account? <Link to="/login" className="text-brand-600">Log in</Link>
      </p>
    </div>
  );
}
