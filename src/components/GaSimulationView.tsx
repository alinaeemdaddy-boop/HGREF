import React, { useState, useEffect } from 'react';
import { Project, TestCase } from '../types';
import { 
  Dna, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle2, 
  ListOrdered,
  RefreshCw,
  Cpu,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { DEFAULT_TESTCASES_FITKEEP, DEFAULT_TESTCASES_OPENTASKS } from '../data/defaultData';

interface GaSimulationViewProps {
  activeProject: Project;
  onUpdateProjectOptimization: (
    projectId: string, 
    bestFitness: number, 
    generation: number, 
    testCases: TestCase[]
  ) => void;
}

export default function GaSimulationView({ activeProject, onUpdateProjectOptimization }: GaSimulationViewProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [generation, setGeneration] = useState(activeProject.generation || 0);
  const [bestFitness, setBestFitness] = useState(activeProject.bestFitness || 0);
  const [mutationRate, setMutationRate] = useState(0.05);
  const [populationSize, setPopulationSize] = useState(100);
  
  const [gaLogs, setGaLogs] = useState<string[]>(
    generation > 0 
      ? ['[GENETIC] Chromosome population has successfully converged after 100 generations.', '[GENETIC] High-fitness prioritized test suite exported.']
      : ['[GENETIC] GA Optimizer ready. Waiting for optimization initialization...']
  );

  const [testSuite, setTestSuite] = useState<TestCase[]>(activeProject.testCases || []);

  // Update states if active project context shifts
  useEffect(() => {
    setGeneration(activeProject.generation || 0);
    setBestFitness(activeProject.bestFitness || 0);
    setTestSuite(activeProject.testCases || []);
    setGaLogs(
      activeProject.generation && activeProject.generation > 0
        ? ['[GENETIC] Chromosome population has successfully converged after 100 generations.', '[GENETIC] High-fitness prioritized test suite exported.']
        : ['[GENETIC] GA Optimizer ready. Waiting for optimization initialization...']
    );
  }, [activeProject.id]);

  const handleStartGA = () => {
    if (isOptimizing) return;
    setIsOptimizing(true);

    let currentGen = 0;
    let currentFitness = 0.42;
    setGeneration(0);
    setBestFitness(0.42);
    setTestSuite([]);
    setGaLogs(['[GENETIC] Initializing population of 100 test path chromosomes...']);

    const interval = setInterval(() => {
      currentGen += 10;
      if (currentGen > 100) {
        currentGen = 100;
        currentFitness = 0.942;
        setIsOptimizing(false);
        clearInterval(interval);

        // Assign test cases upon successful generation
        let finalTestCases: TestCase[] = [];
        if (activeProject.id === 'p2') {
          finalTestCases = DEFAULT_TESTCASES_FITKEEP;
        } else if (activeProject.id === 'p1') {
          finalTestCases = DEFAULT_TESTCASES_OPENTASKS;
        } else {
          // Fallback for custom projects
          finalTestCases = [
            { testId: 'TC-GEN-01', screenName: 'MainActivity', priority: 'High', riskLevel: 'Tier 1', executionTime: '1.5s', status: 'Passed', actions: ['Launch custom activity', 'Explore custom elements'] },
            { testId: 'TC-GEN-02', screenName: 'DetailActivity', priority: 'High', riskLevel: 'Tier 2', executionTime: '2.0s', status: 'Passed', actions: ['Click custom buttons'] }
          ];
        }

        setGeneration(100);
        setBestFitness(0.942);
        setTestSuite(finalTestCases);
        setGaLogs(prev => [
          ...prev,
          `[GEN 100] Crossover convergence threshold reached (sigma < 0.01).`,
          `[GENETIC] Optimized test suite generated! Chromosome fitness stabilized at 94.2%.`
        ]);

        onUpdateProjectOptimization(activeProject.id, 0.942, 100, finalTestCases);
        return;
      }

      // Increment fitness curve
      currentFitness = 0.42 + (Math.log1p(currentGen / 100) * 0.48) + (Math.sin(currentGen) * 0.01);
      if (currentFitness > 0.942) currentFitness = 0.942;

      setGeneration(currentGen);
      setBestFitness(currentFitness);

      // Add genetic-themed logs
      const geneticLogs = [
        `[GEN ${currentGen}] Selection: Tournament parent mating selected top 15% chromosomes.`,
        `[GEN ${currentGen}] Crossover: Single-point layout splicing completed. Offspring initialized.`,
        `[GEN ${currentGen}] Mutation: Randomly flipped location/gesture triggers in 5 chromosomes.`,
        `[GEN ${currentGen}] Fitness evaluation: Best candidate coverage efficiency increased.`
      ];
      const randomLog = geneticLogs[Math.floor(Math.random() * geneticLogs.length)];
      setGaLogs(prev => [...prev, randomLog]);

    }, 350);
  };

  if (!activeProject.apkInfo) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center space-y-6 shadow-premium max-w-xl mx-auto my-8 animate-fade-in">
        <div className="mx-auto h-16 w-16 bg-blue-50/50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100/50">
          <Dna className="h-8 w-8 animate-pulse text-blue-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-800 tracking-tight font-display">Target APK Not Uploaded</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            The Genetic Priority Optimizer requires a valid layout map to initialize sequence chromosomes.
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 text-[11px] text-slate-500 leading-relaxed text-left">
          <span className="font-bold text-slate-700 block mb-1">How to proceed:</span>
          Please navigate to the <strong className="text-blue-600 font-semibold">Upload APK</strong> section in the sidebar menu, select your Android binary, and run the layout extractor to bootstrap active context components.
        </div>
      </div>
    );
  }

  return (
    <div id="ga-simulation-view" className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-premium">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">Evolutionary Optimizer</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-display">Genetic Priority Optimizer</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Mutate and splice test sequence chromosomes to prioritize high-risk activities and maximize path coverage.
          </p>
        </div>

        <button
          onClick={handleStartGA}
          disabled={isOptimizing}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-300 disabled:to-indigo-300 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/15 shrink-0"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Splicing chromosomes ({generation}/100)...</span>
            </>
          ) : (
            <>
              <Dna className="h-4 w-4" />
              <span>Generate Optimized Test Suite</span>
            </>
          )}
        </button>
      </div>

      {/* GA Parameter grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Population Size */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition duration-300 flex flex-col justify-between h-[125px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Chromosome Population</p>
            <span className="p-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-semibold font-mono">POP</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 font-display mt-1.5 tracking-tight">{populationSize} <span className="text-slate-400 text-sm font-normal">sequences</span></p>
            <p className="text-[10px] text-slate-400 mt-3 truncate">1 chromosome = 1 GUI traversal route</p>
          </div>
        </div>

        {/* Current Generation */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition duration-300 flex flex-col justify-between h-[125px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Generation</p>
            <span className="p-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-semibold font-mono">GEN</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 font-display mt-1.5 tracking-tight">{generation} <span className="text-slate-400 text-sm font-normal">/ 100</span></p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300" style={{ width: `${generation}%` }} />
            </div>
          </div>
        </div>

        {/* Best Fitness */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition duration-300 flex flex-col justify-between h-[125px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Best Sequence Fitness</p>
            <span className="p-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-semibold font-mono font-display">FIT</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 font-display mt-1.5 tracking-tight">{(bestFitness * 100).toFixed(1)}%</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${bestFitness * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Mutation Rate */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition duration-300 flex flex-col justify-between h-[125px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mutation Probability</p>
            <span className="p-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-semibold font-mono">MUT</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 font-display mt-1.5 tracking-tight">{(mutationRate * 100).toFixed(0)}%</p>
            <p className="text-[10px] text-slate-400 mt-3 truncate">Avoids local optima traps</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prioritized Output Cases */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered className="h-4.5 w-4.5 text-blue-600" /> Prioritized Test Suite Output
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Test sequences ranked by calculated coverage weight and hazard tier risk scores</p>
            </div>
            
            <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {testSuite.length} Cases Generated
            </span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {testSuite.length > 0 ? (
              testSuite.map((tc, idx) => (
                <div key={tc.testId} className="border border-slate-200 rounded-xl p-3.5 hover:border-slate-300 transition flex justify-between items-center bg-slate-50/40 shadow-sm">
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        Rank #{idx + 1}
                      </span>
                      <strong className="text-xs font-bold text-slate-900">{tc.testId}</strong>
                      <span className="text-slate-400 text-[11px] font-mono">@{tc.screenName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic truncate max-w-sm">
                      Actions: {tc.actions.join(' → ')}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      tc.priority === 'High' ? 'bg-rose-50 text-rose-800 border border-rose-100' :
                      tc.priority === 'Medium' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                      'bg-slate-50 text-slate-600 border border-slate-100'
                    }`}>
                      {tc.priority} Priority
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1.5 font-mono">Est: {tc.executionTime}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 italic space-y-2">
                <p className="text-xs">No optimized test suites generated yet.</p>
                <p className="text-[10px] text-slate-400/80">Click the "Generate Optimized Test Suite" button above to execute genetic splicing.</p>
              </div>
            )}
          </div>
        </div>

        {/* GA evolution log tracker */}
        <div className="bg-slate-950 text-slate-300 rounded-xl p-4.5 border border-slate-800 flex flex-col h-[385px] overflow-hidden shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800 flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-blue-500 animate-pulse" /> Genetic Evolution Logs
          </p>
          <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] pr-1">
            {gaLogs.map((log, i) => (
              <div key={i} className={log.includes('[GENETIC]') ? 'text-blue-400' : 'text-slate-400'}>
                {log}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-3 mt-3 text-[10px] text-slate-500 leading-relaxed">
            <Info className="h-3.5 w-3.5 inline text-blue-600 mr-1 shrink-0" />
            <strong>Seed Selection:</strong> By feeding high-reward Q-table state sequences from the RL phase into the initial GA population, the framework avoids starting genetic evolution with blind randomized sequences.
          </div>
        </div>
      </div>
    </div>
  );
}
