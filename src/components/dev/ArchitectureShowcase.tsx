import React, { useState } from 'react';
import {
  GitPullRequest,
  CheckCircle2,
  Zap,
  Smartphone,
  RotateCcw,
  Sliders,
  Layers,
  Bug,
  Activity,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { networkConfig, setNetworkLatency, setSimulateFailure } from '../../lib/mockData';

export interface ArchitectureShowcaseProps {
  serverDurationMs?: number;
  totalUsersCount: number;
}

const PR_ITEMS = [
  {
    id: 'PR #1',
    title: 'Extract DataTable into components/ui/ & reuse across pages',
    description: 'Extracted generic DataTable, Pagination, TableToolbar, and StatusBadge. Eliminated ~420 lines of redundant table boilerplate across Users, Projects, and Audit views.',
    badge: 'Code Architecture',
    impact: '-420 LOC duplication',
    color: 'border-blue-500 text-blue-700 bg-blue-50',
  },
  {
    id: 'PR #2',
    title: 'Move filter state into URL search params',
    description: 'Synced search, role, status, page, and presets into window search params. State survives full page reload, back/forward navigation, and can be bookmarked.',
    badge: 'UX & State',
    impact: '100% shareable URLs',
    color: 'border-purple-500 text-purple-700 bg-purple-50',
  },
  {
    id: 'PR #3',
    title: 'Server-side pagination with cursor-ready indexing',
    description: '1,247+ users fetched in 25-row slices instead of hydrating the entire tree into the DOM. Dropped initial payload transfer and response time from ~4s to ~80ms.',
    badge: 'Performance',
    impact: '4s → 80ms query speed',
    color: 'border-emerald-500 text-emerald-700 bg-emerald-50',
  },
  {
    id: 'PR #4',
    title: 'Adaptive mobile card layout below 640px',
    description: 'Conditional card layout for viewport widths < 640px with responsive avatar details, inline status tags, and tap-to-trigger row actions drawer.',
    badge: 'Mobile UX',
    impact: 'Zero horizontal scroll on phones',
    color: 'border-amber-500 text-amber-700 bg-amber-50',
  },
  {
    id: 'PR #5',
    title: 'Optimistic role & status updates with rollback on error',
    description: 'TanStack Query cache is patched immediately on role select. If the network or server rejects the payload, state automatically reverts with error notification.',
    badge: 'State Resilience',
    impact: '0ms perceived latency',
    color: 'border-rose-500 text-rose-700 bg-rose-50',
  },
  {
    id: 'PR #6',
    title: 'Memoize table columns & row models',
    description: 'Stabilized column definition arrays and cell components with useMemo and React.memo, reducing unnecessary rerenders on large datasets.',
    badge: 'Render Optimization',
    impact: '-40% render overhead',
    color: 'border-cyan-500 text-cyan-700 bg-cyan-50',
  },
];

export function ArchitectureShowcase({ serverDurationMs = 85, totalUsersCount }: ArchitectureShowcaseProps) {
  const [latency, setLatency] = useState(networkConfig.latencyMs);
  const [failMode, setFailMode] = useState(networkConfig.simulateFailure);

  const handleLatencyChange = (ms: number) => {
    setLatency(ms);
    setNetworkLatency(ms);
  };

  const handleFailToggle = (val: boolean) => {
    setFailMode(val);
    setSimulateFailure(val);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Latency & Server Stat */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Simulated Server Speed</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{serverDurationMs} ms</span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              p95 benchmark
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Server-side pagination filters across {totalUsersCount.toLocaleString()} indexed records.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Network Latency</span>
            <Sliders className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {[0, 85, 300, 800].map((ms) => (
              <button
                key={ms}
                onClick={() => handleLatencyChange(ms)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  latency === ms
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ms === 0 ? 'Instant' : `${ms}ms`}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">Simulate mobile 3G, fiber or zero-latency test</p>
        </div>

        {/* Test Optimistic Rollback */}
        <div className={`rounded-xl border p-4 shadow-xs transition-colors ${
          failMode ? 'border-rose-300 bg-rose-50/60' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-500">
              PR #5 Error Rollback
            </span>
            <Bug className={`h-4 w-4 ${failMode ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={failMode}
              onChange={(e) => handleFailToggle(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            <span className="text-xs font-semibold text-slate-800">
              Simulate 500 API Failures
            </span>
          </label>
          <p className="text-xs text-slate-500 mt-2">
            When checked, change a user role or delete a row to see TanStack Query roll back cache on error.
          </p>
        </div>
      </div>

      {/* PR Roadmap Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Trial Task Refactor Roadmap (PR #1 – PR #6)
            </h3>
            <p className="text-xs text-slate-500">
              Step-by-step breakdown of how a production SaaS codebase was transformed from monolithic to reusable.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PR_ITEMS.map((pr) => (
            <div
              key={pr.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <GitPullRequest className="h-3.5 w-3.5 text-blue-600" />
                  {pr.id}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${pr.color}`}>
                  {pr.impact}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 leading-snug">{pr.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{pr.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
