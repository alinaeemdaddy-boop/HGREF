import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  UploadCloud, 
  Cpu, 
  ShieldAlert, 
  BrainCircuit, 
  Dna, 
  FileCheck2, 
  FileText, 
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Project, User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  projects: Project[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  projects,
  activeProjectId,
  setActiveProjectId
}: SidebarProps) {
  const activeProject = projects.find(p => p.id === activeProjectId);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'upload', label: 'Upload APK', icon: UploadCloud },
    { id: 'analysis', label: 'GUI Analysis', icon: Cpu },
    { id: 'risk', label: 'Risk Classification', icon: ShieldAlert },
    { id: 'rl', label: 'RL Simulation', icon: BrainCircuit },
    { id: 'ga', label: 'GA Simulation', icon: Dna },
    { id: 'test-cases', label: 'Test Cases', icon: FileCheck2 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside id="sidebar" className="w-64 bg-white text-slate-800 flex flex-col h-screen sticky top-0 overflow-y-auto border-r border-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold text-lg shadow-sm">
          H
        </div>
        <div>
          <h1 className="font-bold text-base text-slate-800 tracking-tight">HRGAF Framework</h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Thesis Research v1.2</p>
        </div>
      </div>

      {/* Active Project Selector in Sidebar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Scope / Project Context
        </label>
        <select
          id="project-selector"
          value={activeProjectId}
          onChange={(e) => setActiveProjectId(e.target.value)}
          className="w-full bg-white border border-slate-200 text-xs text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm font-medium"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {activeProject && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${
              activeProject.status === 'Ready' ? 'bg-emerald-500' :
              activeProject.status === 'GUI Analyzed' ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
            <span className="text-[10px] text-slate-500 italic font-medium">
              {activeProject.status}
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav id="sidebar-navigation" className="flex-1 py-4 space-y-0.5">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-3 w-3 text-blue-600" />}
            </button>
          );
        })}
      </nav>

      {/* Footer / Researcher Profiles */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 text-xs font-bold uppercase">
            {user.username.substring(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">{user.username}</p>
            <p className="text-[10px] text-slate-400 font-medium truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 transition shadow-sm"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
