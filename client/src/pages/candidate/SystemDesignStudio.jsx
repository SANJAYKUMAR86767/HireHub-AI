import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Layers,
  Sparkles,
  ArrowLeft,
  Server,
  Database,
  Globe,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Activity,
  Plus,
  Trash2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

const AVAILABLE_COMPONENTS = [
  { id: "client", name: "Web & Mobile Clients", icon: Globe, desc: "End-user browsers & native mobile apps", color: "from-blue-500 to-indigo-600" },
  { id: "cdn", name: "Cloudflare / CDN Edge", icon: Globe, desc: "Global edge asset caching & DDoS shielding", color: "from-amber-500 to-orange-600" },
  { id: "load-balancer", name: "Envoy / Nginx Load Balancer", icon: Layers, desc: "SSL termination, reverse proxy & health checks", color: "from-purple-500 to-pink-600" },
  { id: "api-gateway", name: "Kong / GraphQL API Gateway", icon: Cpu, desc: "Rate limiting, auth verification & routing", color: "from-indigo-500 to-blue-600" },
  { id: "microservices", name: "Node.js / Go Microservices", icon: Server, desc: "Stateless containerized application logic", color: "from-emerald-500 to-teal-600" },
  { id: "redis-cache", name: "Redis In-Memory Cache Cluster", icon: Zap, desc: "Sub-millisecond latency cache-aside store", color: "from-rose-500 to-red-600" },
  { id: "kafka-queue", name: "Apache Kafka Event Bus", icon: Activity, desc: "High-throughput asynchronous message broker", color: "from-cyan-500 to-blue-600" },
  { id: "sharded-db", name: "PostgreSQL / MongoDB (Primary/Replica)", icon: Database, desc: "Persistent ACID store with read replicas", color: "from-teal-500 to-emerald-600" },
];

export default function SystemDesignStudio() {
  const [activeNodes, setActiveNodes] = useState([
    AVAILABLE_COMPONENTS[0], // Client
    AVAILABLE_COMPONENTS[1], // CDN
    AVAILABLE_COMPONENTS[2], // Load balancer
    AVAILABLE_COMPONENTS[4], // Microservices
    AVAILABLE_COMPONENTS[5], // Redis cache
    AVAILABLE_COMPONENTS[7], // Database
  ]);

  const [evaluating, setEvaluating] = useState(false);
  const [audit, setAudit] = useState(null);

  const evaluateArchitecture = async () => {
    setEvaluating(true);
    try {
      const res = await api.post("/advanced/system-design-eval", {
        nodes: activeNodes,
      });
      setAudit(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    evaluateArchitecture();
  }, [activeNodes]);

  const addComponent = (comp) => {
    if (!activeNodes.some((n) => n.id === comp.id)) {
      setActiveNodes([...activeNodes, comp]);
    }
  };

  const removeComponent = (id) => {
    setActiveNodes(activeNodes.filter((n) => n.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/candidate/dashboard"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              System Design & Architecture Playground
            </h1>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Live SPOF Auditor</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveNodes([
            AVAILABLE_COMPONENTS[0],
            AVAILABLE_COMPONENTS[1],
            AVAILABLE_COMPONENTS[2],
            AVAILABLE_COMPONENTS[3],
            AVAILABLE_COMPONENTS[4],
            AVAILABLE_COMPONENTS[5],
            AVAILABLE_COMPONENTS[6],
            AVAILABLE_COMPONENTS[7],
          ])}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Load Enterprise High-Scale Topology</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Component Pallet & Topology Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Topology Canvas */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
                Active Architecture Node Flow ({activeNodes.length} Components)
              </span>
              <span className="text-xs text-slate-500">Live Traffic Flow (Left to Right)</span>
            </div>

            {/* Visual Node Chain */}
            <div className="space-y-3">
              {activeNodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <div key={node.id} className="relative">
                    <div className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-2xl flex items-center justify-between shadow-md transition group">
                      <div className="flex items-center space-x-3.5">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${node.color} text-white shadow-sm`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-white">{node.name}</h4>
                          <p className="text-[11px] text-slate-400">{node.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => removeComponent(node.id)}
                        className="text-slate-500 hover:text-rose-400 p-2 rounded-lg transition opacity-60 group-hover:opacity-100"
                        title="Remove Component"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {index < activeNodes.length - 1 && (
                      <div className="h-4 flex items-center justify-center">
                        <div className="w-0.5 h-full bg-slate-700" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Component Pallet */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <h3 className="font-extrabold text-xs text-indigo-300 uppercase tracking-wider">
              Available Infrastructure Building Blocks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_COMPONENTS.map((comp) => {
                const Icon = comp.icon;
                const isAdded = activeNodes.some((n) => n.id === comp.id);
                return (
                  <button
                    key={comp.id}
                    disabled={isAdded}
                    onClick={() => addComponent(comp)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                      isAdded
                        ? "bg-slate-950/40 border-slate-800/40 text-slate-600 cursor-not-allowed"
                        : "bg-slate-950 border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2 rounded-xl bg-gradient-to-tr ${comp.color} text-white`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold">{comp.name.split(" ")[0]} {comp.name.split(" ")[1] || ""}</span>
                    </div>
                    {isAdded ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Plus className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Resilience & SPOF Audit Output (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {audit && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    AI Resilience & Scalability Scorecard
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">{audit.gradeSummary}</h3>
                </div>
                <div className="text-center bg-slate-950 border border-indigo-500/40 px-4 py-2.5 rounded-2xl">
                  <span className="text-2xl font-black text-amber-400">{audit.resilienceScore}%</span>
                  <span className="block text-[9px] font-extrabold text-indigo-300 uppercase">Resilience</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Estimated Throughput</span>
                  <p className="font-extrabold text-emerald-400 mt-1">{audit.estimatedQps}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">P99 Latency Target</span>
                  <p className="font-extrabold text-indigo-300 mt-1">{audit.latencyGrade}</p>
                </div>
              </div>

              {/* SPOF Warnings */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2.5">
                  <AlertTriangle className="w-4 h-4" /> Single Point of Failure (SPOF) Warnings:
                </h4>
                {audit.spofRisks.length === 0 ? (
                  <p className="text-xs text-emerald-300 bg-emerald-950/30 p-3 rounded-2xl border border-emerald-500/20">
                    No critical SPOFs identified. Architecture is well-decoupled.
                  </p>
                ) : (
                  <ul className="space-y-2 text-xs text-slate-300">
                    {audit.spofRisks.map((risk, idx) => (
                      <li key={idx} className="bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-xl">
                        {risk}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Scalability Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-2.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Architectural Recommendations:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {audit.recommendations.map((rec, idx) => (
                    <li key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl flex items-start space-x-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
