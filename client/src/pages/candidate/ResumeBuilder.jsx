import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FileText, Printer, Save, Sparkles, Layout, User, Briefcase, GraduationCap, Code2, Award, CheckCircle2 } from "lucide-react";

const EMPTY = {
  template: "modern",
  personalInfo: { fullName: "", title: "", email: "", phone: "", location: "", linkedin: "", website: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

const TEMPLATES = [
  { id: "modern", label: "Executive Glass Modern" },
  { id: "classic", label: "Classic Corporate Serif" },
  { id: "minimal", label: "Minimalist Tech ATS" },
];

export default function ResumeBuilder() {
  const [data, setData] = useState(EMPTY);
  const [skillsInput, setSkillsInput] = useState("");
  const [certsInput, setCertsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/resume/builder").then((res) => {
      if (res.data && Object.keys(res.data).length) {
        const merged = { ...EMPTY, ...res.data, personalInfo: { ...EMPTY.personalInfo, ...(res.data.personalInfo || {}) } };
        setData(merged);
        setSkillsInput((merged.skills || []).join(", "));
        setCertsInput((merged.certifications || []).join(", "));
      }
    });
  }, []);

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }));
  const updatePersonal = (field, value) =>
    setData((d) => ({ ...d, personalInfo: { ...d.personalInfo, [field]: value } }));

  const addItem = (field, item) => setData((d) => ({ ...d, [field]: [...d[field], item] }));
  const updateItem = (field, idx, key, value) =>
    setData((d) => {
      const list = [...d[field]];
      list[idx] = { ...list[idx], [key]: value };
      return { ...d, [field]: list };
    });
  const removeItem = (field, idx) =>
    setData((d) => ({ ...d, [field]: d[field].filter((_, i) => i !== idx) }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
        certifications: certsInput.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const res = await api.post("/resume/builder", payload);
      setData((d) => ({ ...d, ...res.data }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const previewData = {
    ...data,
    skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
    certifications: certsInput.split(",").map((s) => s.trim()).filter(Boolean),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 print:py-0 print:px-0 print:max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Powered PDF Generator</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Smart Resume Studio</h1>
          <p className="text-xs text-slate-500 mt-0.5">Build ATS-optimized resumes with real-time live preview templates</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={save}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Profile..." : "Save Resume Data"}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>
      {saved && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Resume data synced & saved successfully!</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* FORM SIDE */}
        <div className="space-y-5 print:hidden">
          {/* Template Switcher */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Layout className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Select Layout Template</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update("template", t.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                    data.template === t.id
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Personal & Contact Info</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full name" value={data.personalInfo.fullName} onChange={(v) => updatePersonal("fullName", v)} placeholder="John Doe" />
              <Input label="Professional Title" value={data.personalInfo.title} onChange={(v) => updatePersonal("title", v)} placeholder="Senior Software Engineer" />
              <Input label="Email Address" value={data.personalInfo.email} onChange={(v) => updatePersonal("email", v)} placeholder="john@example.com" />
              <Input label="Phone Number" value={data.personalInfo.phone} onChange={(v) => updatePersonal("phone", v)} placeholder="+91 9876543210" />
              <Input label="Location" value={data.personalInfo.location} onChange={(v) => updatePersonal("location", v)} placeholder="Bangalore, IN" />
              <Input label="LinkedIn URL" value={data.personalInfo.linkedin} onChange={(v) => updatePersonal("linkedin", v)} placeholder="linkedin.com/in/johndoe" />
            </div>
          </div>

          {/* Professional Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Professional Summary</h3>
            <textarea
              value={data.summary}
              onChange={(e) => update("summary", e.target.value)}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Results-driven Engineer with 5+ years building scalable MERN web applications..."
            />
          </div>

          {/* Experience */}
          <ListSection
            title="Work Experience"
            icon={Briefcase}
            items={data.experience}
            onAdd={() => addItem("experience", { role: "", company: "", duration: "", description: "" })}
            onRemove={(i) => removeItem("experience", i)}
            renderFields={(item, i) => (
              <>
                <Input label="Role" value={item.role} onChange={(v) => updateItem("experience", i, "role", v)} placeholder="Lead Developer" />
                <Input label="Company" value={item.company} onChange={(v) => updateItem("experience", i, "company", v)} placeholder="TechCorp" />
                <Input label="Duration" value={item.duration} onChange={(v) => updateItem("experience", i, "duration", v)} placeholder="Jan 2022 - Present" />
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem("experience", i, "description", e.target.value)}
                  rows={2}
                  className="col-span-2 w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  placeholder="Key responsibilities and achievements..."
                />
              </>
            )}
          />

          {/* Education */}
          <ListSection
            title="Education"
            icon={GraduationCap}
            items={data.education}
            onAdd={() => addItem("education", { degree: "", institute: "", year: "" })}
            onRemove={(i) => removeItem("education", i)}
            renderFields={(item, i) => (
              <>
                <Input label="Degree" value={item.degree} onChange={(v) => updateItem("education", i, "degree", v)} placeholder="B.Tech Computer Science" />
                <Input label="Institute" value={item.institute} onChange={(v) => updateItem("education", i, "institute", v)} placeholder="IIT Delhi" />
                <Input label="Passing Year" value={item.year} onChange={(v) => updateItem("education", i, "year", v)} placeholder="2022" />
              </>
            )}
          />

          {/* Skills & Certifications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Technical Skills (comma-separated)</h3>
              </div>
              <input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                placeholder="React, Node.js, MongoDB, TypeScript, AWS"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Certifications (comma-separated)</h3>
              </div>
              <input
                value={certsInput}
                onChange={(e) => setCertsInput(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                placeholder="AWS Certified Developer Associate, Meta Frontend Professional"
              />
            </div>
          </div>
        </div>

        {/* PREVIEW SIDE */}
        <div className="lg:sticky lg:top-20 self-start print:static">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 print:hidden">Live PDF Preview</h3>
          <ResumePreview data={previewData} />
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <label className="text-[11px] font-semibold text-slate-600 block">
      {label}
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 mt-1 font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </label>
  );
}

function ListSection({ title, icon: Icon, items, onAdd, onRemove, renderFields }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        </div>
        <button onClick={onAdd} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">+ Add Entry</button>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
            {renderFields(item, i)}
            <button onClick={() => onRemove(i)} className="col-span-2 text-xs font-semibold text-rose-500 text-left hover:underline">
              Remove
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400">No items added yet.</p>}
      </div>
    </div>
  );
}

function ResumePreview({ data }) {
  const { template, personalInfo: p, summary, experience, education, skills, projects, certifications } = data;

  // modern default template
  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-xl overflow-hidden print:border-0 print:shadow-none font-sans text-slate-800">
      <div className="bg-slate-900 text-white px-8 py-7 border-b border-slate-800">
        <h2 className="text-2xl font-bold">{p.fullName || "Your Full Name"}</h2>
        <p className="text-indigo-400 text-sm font-medium mt-0.5">{p.title || "Professional Title"}</p>
        <p className="text-xs text-slate-400 mt-2">
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(" · ")}
        </p>
      </div>
      <div className="p-8 space-y-5">
        {summary && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Executive Summary</h4>
            <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Work Experience</h4>
            <div className="space-y-3">
              {experience.map((e, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-900">{e.role}</span>
                    <span className="text-[11px] text-slate-400">{e.duration}</span>
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold">{e.company}</p>
                  <p className="text-xs text-slate-600 mt-1">{e.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Education</h4>
              {education.map((e, i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs font-bold text-slate-900">{e.degree}</p>
                  <p className="text-xs text-slate-500">{e.institute} · {e.year}</p>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Core Skills</h4>
              <div className="flex flex-wrap gap-1">
                {skills.map((s, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 font-semibold text-slate-700 px-2 py-0.5 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {certifications.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Certifications</h4>
            <p className="text-xs text-slate-700 font-medium">{certifications.join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
