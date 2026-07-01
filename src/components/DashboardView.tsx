import React from 'react';
import { 
  Project, 
  GuiComponent, 
  TestCase 
} from '../types';
import { 
  FolderGit2, 
  Layers, 
  Play, 
  FileCheck2, 
  Percent, 
  Flame, 
  Info,
  TrendingUp,
  Brain,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  projects: Project[];
  activeProjectId: string;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardView({ projects, activeProjectId, onNavigateToTab }: DashboardViewProps) {
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Aggregated Stats
  const totalProjects = projects.length;
  const uploadedApks = projects.filter(p => p.apkInfo).length;
  
  // Active Project Stats
  const guiComponentsCount = activeProject.components.length;
  const testCasesCount = activeProject.testCases.length;
  const coveragePercent = activeProject.coverage;
  const crashesCount = activeProject.crashesCount;

  // Render a simple beautiful custom SVG chart comparing Random vs RL vs Hybrid HRGAF (thesis argument!)
  const renderComparisonChart = () => {
    // 0 to 10 iterations
    const randomData = [10, 18, 22, 28, 30, 32, 35, 36, 38, 39, 40];
    const rlData = [10, 28, 45, 55, 62, 68, 71, 74, 76, 78, 79];
    const hrgafData = [10, 35, 58, 69, 78, 83, 84.5, 84.5, 84.5, 84.5, 84.5];

    // SVG parameters
    const width = 500;
    const height = 180;
    const padding = 25;
    
    const getX = (index: number) => padding + (index / 10) * (width - padding * 2);
    const getY = (val: number) => height - padding - (val / 100) * (height - padding * 2);

    const createPath = (data: number[]) => {
      return data.map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`).join(' ');
    };

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((grid, idx) => (
          <g key={idx}>
            <line 
              x1={padding} 
              y1={getY(grid)} 
              x2={width - padding} 
              y2={getY(grid)} 
              stroke="#f1f5f9" 
              strokeWidth="1" 
            />
            <text 
              x={padding - 5} 
              y={getY(grid) + 3} 
              fill="#94a3b8" 
              fontSize="9" 
              textAnchor="end"
              className="font-mono"
            >
              {grid}%
            </text>
          </g>
        ))}

        {/* X Axis ticks */}
        {[0, 2, 4, 6, 8, 10].map((t, idx) => (
          <g key={idx}>
            <line 
              x1={getX(t)} 
              y1={height - padding} 
              x2={getX(t)} 
              y2={height - padding + 4} 
              stroke="#cbd5e1" 
            />
            <text 
              x={getX(t)} 
              y={height - padding + 15} 
              fill="#94a3b8" 
              fontSize="9" 
              textAnchor="middle"
              className="font-mono"
            >
              {t * 100}ep
            </text>
          </g>
        ))}

        {/* Lines */}
        {/* Random path */}
        <path d={createPath(randomData)} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,3" />
        {/* RL Only path */}
        <path d={createPath(rlData)} fill="none" stroke="#3b82f6" strokeWidth="2" />
        {/* HRGAF path */}
        <path d={createPath(hrgafData)} fill="none" stroke="#1d4ed8" strokeWidth="3" />

        {/* Data points for HRGAF */}
        {hrgafData.map((val, i) => (
          <circle 
            key={i} 
            cx={getX(i)} 
            cy={getY(val)} 
            r="3" 
            fill="#1d4ed8" 
            className="hover:r-5 transition-all cursor-pointer"
          />
        ))}
      </svg>
    );
  };

  // Bar Chart of crashes detected by tier
  const renderCrashTierChart = () => {
    // Tiers 1 to 4
    const tiers = [
      { name: 'Tier 1 (Gesture)', count: 4, color: 'bg-rose-500' },
      { name: 'Tier 2 (Runtime)', count: 6, color: 'bg-amber-500' },
      { name: 'Tier 3 (Modal)', count: 3, color: 'bg-blue-500' },
      { name: 'Tier 4 (Context)', count: 1, color: 'bg-emerald-500' }
    ];

    const maxCount = 8;

    return (
      <div className="space-y-3.5 pt-2">
        {tiers.map((tier, i) => {
          const widthPercent = (tier.count / maxCount) * 100;
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>{tier.name}</span>
                <span className="font-mono font-bold">{tier.count} Crashes</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`h-full ${tier.color} rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Upper Welcoming Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center justify-center p-8 pointer-events-none">
          <Brain className="h-44 w-44" />
        </div>
        <div className="max-w-xl">
          <span className="bg-blue-600/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-blue-400/20">
            PhD Thesis Core workflow
          </span>
          <h2 className="text-2xl font-bold tracking-tight mt-2.5">
            Android GUI Testing Framework
          </h2>
          <p className="text-slate-200 text-xs mt-1.5 leading-relaxed">
            Optimizing exploration coverage and test case priority by coupling double-deep Q-networks (RL) and targeted genetic seed populations (GA). Select and simulate below.
          </p>
          <div className="mt-4.5 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateToTab('rl')}
              className="bg-white text-blue-800 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition shadow-sm"
            >
              Start RL training
            </button>
            <button
              onClick={() => onNavigateToTab('ga')}
              className="bg-blue-600/50 hover:bg-blue-600 border border-blue-500/30 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              Generate Optimized Suite
            </button>
          </div>
        </div>
      </div>

      {/* Primary Summary Stats Grid */}
      <div id="stats-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Total Projects */}
        <div className="bg-white border border-slate-200/80 p-4 flex flex-col justify-between shadow-sm rounded-2xl hover:shadow-md hover:border-slate-350 transition duration-200">
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Total Projects</span>
            <div className="p-1 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <FolderGit2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-slate-800 font-mono tracking-tight">{totalProjects}</p>
            <p className="text-[10px] text-green-600 font-bold mt-0.5 truncate">+2 this month</p>
          </div>
        </div>

        {/* 2. Uploaded APKs */}
        <div className="bg-white border border-slate-200/80 p-4 flex flex-col justify-between shadow-sm rounded-2xl hover:shadow-md hover:border-slate-350 transition duration-200">
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Uploaded APKs</span>
            <div className="p-1 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-slate-800 font-mono tracking-tight">{uploadedApks}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">Valid APK binaries</p>
          </div>
        </div>

        {/* 3. GUI Components */}
        <div className="bg-white border border-slate-200/80 p-4 flex flex-col justify-between shadow-sm rounded-2xl cursor-pointer hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/5 transition duration-200" onClick={() => onNavigateToTab('analysis')}>
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">GUI Components</span>
            <div className="p-1 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <Play className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-slate-800 font-mono tracking-tight">{guiComponentsCount}</p>
            <p className="text-[10px] text-blue-600 font-bold mt-0.5 flex items-center gap-0.5 hover:underline truncate">
              84.2% classified <ChevronRight className="h-3 w-3 shrink-0" />
            </p>
          </div>
        </div>

        {/* 4. Test Cases */}
        <div className="bg-white border border-slate-200/80 p-4 flex flex-col justify-between shadow-sm rounded-2xl cursor-pointer hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/5 transition duration-200" onClick={() => onNavigateToTab('test-cases')}>
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Test Cases</span>
            <div className="p-1 bg-sky-50 text-sky-600 rounded-lg shrink-0">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-blue-600 font-mono tracking-tight">{testCasesCount}</p>
            <p className="text-[10px] text-sky-500 font-semibold mt-0.5 flex items-center gap-0.5 hover:underline truncate">
              View suite <ChevronRight className="h-3 w-3 shrink-0" />
            </p>
          </div>
        </div>

        {/* 5. Coverage Percentage */}
        <div className="bg-white border border-slate-200/80 p-4 flex flex-col justify-between shadow-sm rounded-2xl hover:shadow-md hover:border-slate-350 transition duration-200">
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Test Coverage</span>
            <div className="p-1 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-slate-800 font-mono tracking-tight">{coveragePercent.toFixed(0)}%</p>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${coveragePercent}%` }} />
            </div>
          </div>
        </div>

        {/* 6. Detected Crashes */}
        <div className="bg-white border border-slate-200/80 p-4 flex flex-col justify-between shadow-sm rounded-2xl hover:shadow-md hover:border-slate-350 transition duration-200">
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">Crashes Detected</span>
            <div className="p-1 bg-rose-50 text-rose-600 rounded-lg shrink-0">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${crashesCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {crashesCount > 0 ? `0${crashesCount}`.slice(-2) : '00'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">In current APK version</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Interactive Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Exploration Coverage Progress */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-800">RL Training Simulation Progress</h3>
                <p className="text-xs text-slate-500">Comparing hybrid genetic priority against classic model variations</p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase tracking-tighter">
                Active
              </span>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-400 block" /> Random Monkey</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500 block" /> RL-Driven (DDQN)</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-800 block" /> Hybrid HRGAF</span>
            </div>

            {/* Comparison Line Chart */}
            <div className="h-44 mt-4 flex items-center justify-center">
              {renderComparisonChart()}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            <span>Reward convergence trend over last 1k episodes. Hybrid prioritizes high-risk Tiers 1 & 2.</span>
          </div>
        </div>

        {/* Chart 2: Crash Statistics by Risk Tier */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Crashes Detected by Risk Level</h3>
            <p className="text-xs text-slate-500">Grouping based on GUI navigation hazard categorizations</p>
            
            {renderCrashTierChart()}
          </div>

          <div className="text-[11px] bg-slate-50 text-slate-500 p-3 rounded-lg border border-slate-150 mt-4">
            <p className="font-bold flex items-center gap-1 text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 
              Tier 1/2 Coverage Priority
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              High-risk targets (swipe handlers, sensor triggers) receive 2.5x exploration weight.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Project Status Context Notification */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 shrink-0">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Selected Project Context: <span className="text-blue-700">{activeProject.name}</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Current stage: <strong className="text-slate-600 font-bold uppercase tracking-wider text-[10px]">{activeProject.status}</strong> — Click simulation buttons above or use sidebar to transition stages.
            </p>
          </div>
        </div>
        <button 
          onClick={() => onNavigateToTab('projects')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          Manage Projects <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
