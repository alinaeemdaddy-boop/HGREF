import React, { useState } from 'react';
import { 
  Settings, 
  BrainCircuit, 
  Dna, 
  Sliders, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Info
} from 'lucide-react';

export default function SettingsView() {
  const [lr, setLr] = useState(0.001);
  const [gamma, setGamma] = useState(0.99);
  const [epsilon, setEpsilon] = useState(1.0);
  const [updateFreq, setUpdateFreq] = useState(200);

  const [popSize, setPopSize] = useState(100);
  const [mutation, setMutation] = useState(0.05);
  const [crossover, setCrossover] = useState(0.85);
  const [selection, setSelection] = useState('Tournament Selection');

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }, 1200);
  };

  return (
    <div id="settings-view" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Framework Hyperparameters</h2>
        <p className="text-xs text-slate-400">Configure double-deep Q-network exploration models and genetic prioritization operators</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: RL Hyperparameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <BrainCircuit className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Double-DQN Agent Parameters</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Learning rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <label htmlFor="setting-lr">Learning Rate (Alpha)</label>
                <span className="font-mono text-blue-600">{lr}</span>
              </div>
              <input
                id="setting-lr"
                type="range"
                min="0.0001"
                max="0.01"
                step="0.0001"
                value={lr}
                onChange={(e) => setLr(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">Controls SGD weight update magnitude inside target network nodes.</p>
            </div>

            {/* Discount Factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <label htmlFor="setting-gamma">Discount Factor (Gamma)</label>
                <span className="font-mono text-blue-600">{gamma}</span>
              </div>
              <input
                id="setting-gamma"
                type="range"
                min="0.80"
                max="0.99"
                step="0.01"
                value={gamma}
                onChange={(e) => setGamma(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">Controls the priority value ratio between immediate and future exploration rewards.</p>
            </div>

            {/* Initial Epsilon */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <label htmlFor="setting-eps">Initial Exploration Probability (Epsilon)</label>
                <span className="font-mono text-blue-600">{epsilon * 100}%</span>
              </div>
              <input
                id="setting-eps"
                type="range"
                min="0.50"
                max="1.0"
                step="0.05"
                value={epsilon}
                onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">Starting exploration ratio. Decays down to 10% during step increments.</p>
            </div>

            {/* Update Freq */}
            <div className="space-y-1.5">
              <label htmlFor="setting-freq" className="block font-semibold text-slate-700">Target Network Update Frequency</label>
              <select
                id="setting-freq"
                value={updateFreq}
                onChange={(e) => setUpdateFreq(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={100}>Every 100 steps</option>
                <option value={200}>Every 200 steps</option>
                <option value={500}>Every 500 steps</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: GA Hyperparameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Dna className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Genetic Algorithm Prioritizer</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Pop Size */}
            <div className="space-y-1.5">
              <label htmlFor="setting-pop" className="block font-semibold text-slate-700">Initial Chromosome Population</label>
              <select
                id="setting-pop"
                value={popSize}
                onChange={(e) => setPopSize(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={50}>50 sequences</option>
                <option value={100}>100 sequences</option>
                <option value={200}>200 sequences</option>
              </select>
            </div>

            {/* Mutation probability */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <label htmlFor="setting-mut">Mutation Probability (Pm)</label>
                <span className="font-mono text-indigo-600">{mutation * 100}%</span>
              </div>
              <input
                id="setting-mut"
                type="range"
                min="0.01"
                max="0.15"
                step="0.01"
                value={mutation}
                onChange={(e) => setMutation(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10px] text-slate-400">Controls widget node swap probabilities inside individual sequences.</p>
            </div>

            {/* Crossover rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <label htmlFor="setting-cross">Crossover Rate (Pc)</label>
                <span className="font-mono text-indigo-600">{crossover * 100}%</span>
              </div>
              <input
                id="setting-cross"
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={crossover}
                onChange={(e) => setCrossover(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10px] text-slate-400">Splicing probability between types of high-fitness parent sequences.</p>
            </div>

            {/* Selection Strategy */}
            <div className="space-y-1.5">
              <label htmlFor="setting-sel" className="block font-semibold text-slate-700">Crossover Selection Strategy</label>
              <select
                id="setting-sel"
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Tournament Selection">Tournament Selection (Highly Recommended)</option>
                <option value="Roulette Wheel Selection">Roulette Wheel Selection</option>
                <option value="Elitism Splicing">Elitism Splicing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="lg:col-span-2 flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-slate-400" />
            All variables are held locally in session cache to prevent runtime conflicts.
          </div>

          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                <CheckCircle2 className="h-4 w-4" /> Hyperparameters Saved Successfully
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition shadow-sm"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Applying weights...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Hyperparameters</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
