import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { 
  Play, 
  Pause, 
  Square, 
  BrainCircuit, 
  TrendingUp, 
  Sliders, 
  Terminal, 
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface RlSimulationViewProps {
  activeProject: Project;
  onUpdateProjectTraining: (
    projectId: string, 
    coverage: number, 
    episodes: number, 
    crashes: number, 
    history: { episode: number; reward: number; coverage: number }[]
  ) => void;
}

export default function RlSimulationView({ activeProject, onUpdateProjectTraining }: RlSimulationViewProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [episode, setEpisode] = useState(activeProject.episodesCompleted || 0);
  const [reward, setReward] = useState(episode > 0 ? 252 : -150);
  const [coverage, setCoverage] = useState(activeProject.coverage || 15);
  const [epsilon, setEpsilon] = useState(episode > 0 ? 0.10 : 1.0);
  const [detectedCrashes, setDetectedCrashes] = useState(activeProject.crashesCount || 0);
  
  const [logs, setLogs] = useState<string[]>(
    episode > 0 
      ? ['[SYSTEM] Double-DQN neural agent has successfully completed 1000 epochs of navigation graph exploration.', '[SYSTEM] Final state-action value Q-matrix saved to memory.']
      : ['[SYSTEM] Double-DQN Agent initialized. Waiting for training command...']
  );

  const [trainingHistory, setTrainingHistory] = useState<{ episode: number; reward: number; coverage: number }[]>(
    activeProject.rlTrainingHistory || []
  );

  const consoleEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll console logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Handle local state sync if active project context changes
  useEffect(() => {
    setEpisode(activeProject.episodesCompleted || 0);
    setReward(activeProject.episodesCompleted && activeProject.episodesCompleted > 0 ? 252 : -150);
    setCoverage(activeProject.coverage || 15);
    setEpsilon(activeProject.episodesCompleted && activeProject.episodesCompleted > 0 ? 0.10 : 1.0);
    setDetectedCrashes(activeProject.crashesCount || 0);
    setTrainingHistory(activeProject.rlTrainingHistory || []);
    
    setLogs(
      activeProject.episodesCompleted && activeProject.episodesCompleted > 0
        ? ['[SYSTEM] Double-DQN neural agent has successfully completed 1000 epochs of navigation graph exploration.', '[SYSTEM] Final state-action value Q-matrix saved to memory.']
        : ['[SYSTEM] Double-DQN Agent initialized. Waiting for training command...']
    );
  }, [activeProject.id]);

  const handleStartTraining = () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // If starting from scratch, reset values
    let currentEpisode = episode >= 1000 ? 0 : episode;
    let currentCoverage = episode >= 1000 ? 15 : coverage;
    let currentReward = episode >= 1000 ? -150 : reward;
    let currentEpsilon = episode >= 1000 ? 1.0 : epsilon;
    let currentCrashes = episode >= 1000 ? 0 : detectedCrashes;
    let historyAcc = episode >= 1000 ? [] : [...trainingHistory];

    if (currentEpisode === 0) {
      setEpisode(0);
      setCoverage(15);
      setReward(-150);
      setEpsilon(1.0);
      setDetectedCrashes(0);
      setLogs(['[SYSTEM] Training session started. Spinning up TensorFlow / Double-DQN agent graph...']);
    } else {
      setLogs(prev => [...prev, '[SYSTEM] Resuming Double-DQN training session...']);
    }

    intervalRef.current = setInterval(() => {
      currentEpisode += 20;
      if (currentEpisode > 1000) {
        currentEpisode = 1000;
        setIsRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        setLogs(prev => [
          ...prev, 
          `[EP 1000] Goal state achieved. Final Q-table successfully generated.`,
          `[SYSTEM] Double-DQN training completed successfully! Coverage stabilized at ${currentCoverage.toFixed(1)}%.`
        ]);

        onUpdateProjectTraining(activeProject.id, currentCoverage, 1000, currentCrashes, historyAcc);
        return;
      }

      // Math computations for realistic training progression curves
      const progressPercent = currentEpisode / 1000;
      
      // Coverage grows logarithmically from 15% to 84.5%
      currentCoverage = 15 + Math.log1p(progressPercent * 1.7) * 48 + (Math.sin(currentEpisode / 50) * 1.5);
      if (currentCoverage > 84.5) currentCoverage = 84.5;

      // Reward increases from -150 to +252 with noise
      currentReward = -150 + (progressPercent * 380) + (Math.sin(currentEpisode / 30) * 12);
      if (currentReward > 252) currentReward = 252;

      // Epsilon decays exponentially from 1.0 to 0.10
      currentEpsilon = Math.max(0.10, 1.0 - (progressPercent * 0.9));

      // Simulate occasional crashes found at specific high-risk paths
      if (currentEpisode === 240 && currentCrashes === 0) {
        currentCrashes = 1;
        setLogs(prev => [...prev, `[CRASH ALERT] NullPointerException in TaskDetailActivity at line 144 during attachment parsing!`]);
      }
      if (currentEpisode === 680 && currentCrashes === 1) {
        currentCrashes = 2;
        setLogs(prev => [...prev, `[CRASH ALERT] SecurityException during LocationReminderTrigger: user blocked location permission!`]);
      }

      setEpisode(currentEpisode);
      setCoverage(currentCoverage);
      setReward(Math.round(currentReward));
      setEpsilon(currentEpsilon);
      setDetectedCrashes(currentCrashes);

      // Generate random log strings matching the activity list
      const logOptions = [
        `[EP ${currentEpisode}] Action: LongPress TaskPriorityHandle. Valid state shift. Reward: +12`,
        `[EP ${currentEpisode}] Action: Tap AddTaskFab -> Transition to TaskDetailActivity. Reward: +25`,
        `[EP ${currentEpisode}] Action: SwipedDismiss Task Item. Deleted node confirmed. Reward: +30`,
        `[EP ${currentEpisode}] Action: Click CategoryFilterSpinner. Populating categories. Reward: +8`,
        `[EP ${currentEpisode}] Action: Toggle DarkMode. UI recreate event completed. Reward: +15`,
        `[EP ${currentEpisode}] Action: Click DueDateCalendarPicker. Modal bottom sheet explored. Reward: +20`
      ];
      const randomLog = logOptions[Math.floor(Math.random() * logOptions.length)];
      setLogs(prev => [...prev, randomLog]);

      // Add to training history every 100 episodes
      if (currentEpisode % 100 === 0) {
        historyAcc.push({ episode: currentEpisode, reward: Math.round(currentReward), coverage: Number(currentCoverage.toFixed(1)) });
        setTrainingHistory([...historyAcc]);
      }

    }, 250);
  };

  const handlePauseTraining = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setLogs(prev => [...prev, '[SYSTEM] Training paused. Current state and weights held in cache memory.']);
  };

  const handleStopTraining = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Sync current values even if stopped early
    onUpdateProjectTraining(activeProject.id, coverage, episode, detectedCrashes, trainingHistory);
    setLogs(prev => [...prev, '[SYSTEM] Training session terminated by user. Current state synced back to workspace.']);
  };

  if (!activeProject.apkInfo) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center space-y-6 shadow-premium max-w-xl mx-auto my-8 animate-fade-in">
        <div className="mx-auto h-16 w-16 bg-blue-50/50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100/50">
          <BrainCircuit className="h-8 w-8 animate-pulse text-blue-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-800 tracking-tight font-display">Target APK Not Uploaded</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            The reinforcement learning agent requires a valid target APK file structure to construct the action-space state graph.
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
    <div id="rl-simulation-view" className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-premium">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">Reinforcement Learning Core</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-display">Double-DQN Training Simulator</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Train a double-deep Q-network agent with customized discount factors to automatically discover coverage-maximizing sequences.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleStartTraining}
            disabled={isRunning}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-300 disabled:to-indigo-300 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/15"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>{episode > 0 && episode < 1000 ? 'Resume Agent' : 'Start Agent'}</span>
          </button>
          <button
            onClick={handlePauseTraining}
            disabled={!isRunning}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Pause className="h-4 w-4" />
            <span>Pause</span>
          </button>
          <button
            onClick={handleStopTraining}
            disabled={!isRunning && episode === 0}
            className="flex items-center gap-2 bg-rose-50/50 border border-rose-100 hover:bg-rose-50 disabled:opacity-40 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            <span>Stop & Sync</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Episode */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition duration-300 flex flex-col justify-between h-[125px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Episodes Completed</p>
            <span className="p-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-semibold font-mono">DQN-EP</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 font-display mt-1.5 tracking-tight">{episode} <span className="text-slate-400 text-sm font-normal">/ 1000</span></p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${(episode / 1000) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Current Reward */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition duration-300 flex flex-col justify-between h-[125px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cumulative Reward</p>
            <span className="p-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-semibold font-mono">REW</span>
          </div>
          <div>
            <p className={`text-2xl font-bold font-display mt-1.5 tracking-tight ${reward >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {reward > 0 ? `+${reward}` : reward}
            </p>
            <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0 animate-pulse" />
              <span>Value convergence locked</span>
            </p>
          </div>
        </div>

        {/* Coverage progress */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition duration-300 flex flex-col justify-between h-[125px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Node Coverage</p>
            <span className="p-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-semibold font-mono">COV</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 font-display mt-1.5 tracking-tight">{coverage.toFixed(1)}%</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${coverage}%` }} />
            </div>
          </div>
        </div>

        {/* Epsilon Exploration rate */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition duration-300 flex flex-col justify-between h-[125px]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Epsilon Decay</p>
            <span className="p-1 bg-violet-50 text-violet-600 rounded-lg text-[10px] font-semibold font-mono">EPS</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 font-display mt-1.5 tracking-tight">{(epsilon * 100).toFixed(0)}%</p>
            <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${epsilon > 0.5 ? 'bg-violet-500 animate-ping' : 'bg-indigo-500'}`} />
              <span className="truncate">{epsilon > 0.5 ? 'Exploring states' : 'Exploiting Q-values'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal/Log view */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col h-[360px] overflow-hidden shadow-xl">
          <div className="bg-slate-900/95 px-4 py-3.5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shrink-0" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shrink-0" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shrink-0" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider ml-2 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-blue-500 shrink-0" /> DDQN State Exploration Console
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{isRunning ? 'Running' : 'Standby'}</span>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-2 font-mono text-[10px] text-slate-300 scrollbar-thin">
            {logs.map((log, idx) => (
              <div 
                key={idx} 
                className={`p-1.5 rounded-lg leading-relaxed ${
                  log.includes('[CRASH') ? 'text-rose-400 bg-rose-950/30 border border-rose-900/40 px-2' :
                  log.includes('[SYSTEM]') ? 'text-sky-400 bg-sky-950/20 border border-sky-900/20 px-2' : 
                  'text-slate-300 hover:bg-slate-900/40 transition px-2'
                }`}
              >
                <span className="text-slate-500 mr-2 select-none">{(idx + 1).toString().padStart(3, '0')}</span>
                {log}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        </div>

        {/* Side Panel: Agent Policy details */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-premium flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display border-b border-slate-50 pb-2">Agent Policy Parameters</h3>
            
            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex justify-between pb-2 border-b border-slate-50">
                <span className="text-slate-400">Neural Network Model</span>
                <strong className="text-slate-800 font-semibold font-display">Double-DQN</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-50">
                <span className="text-slate-400">Discount Factor (Gamma)</span>
                <strong className="text-slate-800 font-semibold font-mono">0.99</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-50">
                <span className="text-slate-400">Learning Rate (Alpha)</span>
                <strong className="text-slate-800 font-semibold font-mono">0.001</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-50">
                <span className="text-slate-400">Experience Replay Buffer</span>
                <strong className="text-slate-800 font-semibold font-mono">50k steps</strong>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Exceptions Caught</span>
                <strong className={`font-semibold font-mono ${detectedCrashes > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {detectedCrashes} Crashes
                </strong>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/40 text-amber-900 p-4 rounded-xl border border-amber-100/50 text-[11px] leading-relaxed flex gap-2.5">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-800 block">Coverage Limits Info</span>
              <p className="text-amber-900/80">
                Double-DQN excels at deep-state exploration but can be stalled by user input sequence loops. Use the <strong>Genetic Algorithm (GA)</strong> mode to optimize state populating sequences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
