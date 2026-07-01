import React, { useState } from 'react';
import { Project, GuiComponent } from '../types';
import { 
  ShieldAlert, 
  HelpCircle, 
  ChevronRight, 
  TrendingUp, 
  Activity, 
  Compass, 
  Clock, 
  Zap,
  Info
} from 'lucide-react';

interface RiskClassificationViewProps {
  activeProject: Project;
}

export default function RiskClassificationView({ activeProject }: RiskClassificationViewProps) {
  const [activeTab, setActiveTab] = useState<number>(1);

  const tierMeta = [
    {
      tier: 1,
      title: 'Tier 1 – Gesture Sensitive',
      description: 'Dynamic UI components responding to touch gestures (swipe, long-press, drag). These trigger state loops prone to exploration blockages.',
      badgeColor: 'bg-rose-50 border-rose-200 text-rose-800',
      fillColor: 'bg-rose-500',
      icon: Activity
    },
    {
      tier: 2,
      title: 'Tier 2 – Runtime Loaded',
      description: 'Views populated asynchronously via databases, background REST services, or hardware streams (BLE). Timing race conditions are high here.',
      badgeColor: 'bg-amber-50 border-amber-200 text-amber-800',
      fillColor: 'bg-amber-500',
      icon: Clock
    },
    {
      tier: 3,
      title: 'Tier 3 – Modal Interruptive',
      description: 'Interruptive overlays (Alerts, Dialogues, Bottom sheets) that temporarily block background interaction. High risk of trap-states.',
      badgeColor: 'bg-blue-50 border-blue-200 text-blue-800',
      fillColor: 'bg-blue-500',
      icon: Zap
    },
    {
      tier: 4,
      title: 'Tier 4 – Context Aware',
      description: 'Widgets tied to environmental settings (e.g., GPS latitude, system permissions, light themes). Require mocking for stable execution.',
      badgeColor: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      fillColor: 'bg-emerald-500',
      icon: Compass
    }
  ];

  const getComponentsByTier = (tierNum: number) => {
    return activeProject.components.filter(c => c.riskTier === tierNum);
  };

  const getAverageScoreByTier = (tierNum: number) => {
    const list = getComponentsByTier(tierNum);
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, c) => acc + c.riskScore, 0);
    return Math.round(sum / list.length);
  };

  const activeMeta = tierMeta.find(t => t.tier === activeTab) || tierMeta[0];
  const activeComponents = getComponentsByTier(activeTab);

  return (
    <div id="risk-classification-view" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">GUI Risk Tier Mapping</h2>
        <p className="text-xs text-slate-400">Classify widgets using the four hazard levels to prioritize Genetic algorithm test suites</p>
      </div>

      {/* Grid selector of 4 Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {tierMeta.map((t) => {
          const count = getComponentsByTier(t.tier).length;
          const avgScore = getAverageScoreByTier(t.tier);
          const isSelected = activeTab === t.tier;
          const Icon = t.icon;

          return (
            <button
              key={t.tier}
              onClick={() => setActiveTab(t.tier)}
              className={`bg-white border rounded-xl p-4 text-left transition shadow-sm relative overflow-hidden flex flex-col justify-between ${
                isSelected 
                  ? 'border-blue-600 ring-1 ring-blue-600/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className={`p-1.5 rounded-lg border ${t.badgeColor}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                    {count} Elements
                  </span>
                </div>
                
                <h3 className="font-bold text-xs text-slate-800 mt-3">{t.title}</h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                  <span>Average Risk Score</span>
                  <span className="font-bold text-slate-700">{avgScore}/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${t.fillColor} rounded-full`} style={{ width: `${avgScore}%` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tier Details panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-50 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900">{activeMeta.title} Detail Specification</h3>
            <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Selected Level
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{activeMeta.description}</p>
        </div>

        {/* Components inside this tier */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Component Name</th>
                <th className="p-4">Widget Type</th>
                <th className="p-4">Host Screen (Activity)</th>
                <th className="p-4 text-center">Individual Risk Score</th>
                <th className="p-4">State Interaction Vector</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 divide-y divide-slate-50">
              {activeComponents.length > 0 ? (
                activeComponents.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 font-mono text-xs">{c.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {c.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-[11px]">{c.activity}</td>
                    <td className="p-4">
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-bold font-mono text-xs text-slate-800">{c.riskScore}</span>
                        <div className="w-16 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full ${activeMeta.fillColor} rounded-full`} style={{ width: `${c.riskScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 italic text-[11px]">{c.interactionPath || 'Implicit exploration path'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 italic">
                    No components classified in this tier. Run "GUI Structure Analysis" layout parsing first to automatically categorize components.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-[11px] text-blue-800 leading-relaxed">
          <strong>Framework Decision Priority:</strong> The HRGAF framework uses the assigned risk scores as probability weights during the reinforcement learning step. Tiers with scores &gt; 75 represent <strong>hazardous pathways</strong> and are prioritized with increased exploration decay rates to verify state safety and catch potential null-pointer crashes early.
        </div>
      </div>
    </div>
  );
}
