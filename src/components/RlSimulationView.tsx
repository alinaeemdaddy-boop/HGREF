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
      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-4">
        <div className="mx-auto h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <div className="max-w-sm mx-auto space-y-1">
          <h3 className="text-sm font-bold text-slate-800">APK Not Uploaded</h3>
          <p className="text-xs text-slate-400">
            Please upload a target APK first in the <strong>Upload APK</strong> section to start RL agent exploration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="rl-simulation-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Double-DQN Training Simulator</h2>
          <p className="text-xs text-slate-400">Train reinforcement learning agent to maximize coverage over the APK action-space graph</p>
        </div>

        {/* Action controls */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleStartTraining}
            disabled={isRunning}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition"
          >
            <Play className="h-4 w-4" />
            <span>{episode > 0 && episode < 1000 ? 'Resume Agent' : 'Start Agent'}</span>
          </button>
          <button
            onClick={handlePauseTraining}
            disabled={!isRunning}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold transition"
          >
            <Pause className="h-4 w-4" />
            <span>Pause</span>
          </button>
          <button
            onClick={handleStopTraining}
            disabled={!isRunning && episode === 0}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed text-rose-700 px-3.5 py-2 rounded-lg text-xs font-semibold transition"
          >
            <Square className="h-4 w-4" />
            <span>Stop & Sync</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Episode */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Episodes Completed</p>
          <p className="text-3xl font-black text-slate-800 font-mono mt-2">{episode} / 1000</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: `${(episode / 1000) * 100}%` }} />
          </div>
        </div>

        {/* Current Reward */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cumulative Reward Value</p>
          <p className={`text-3xl font-black font-mono mt-2 ${reward >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
            {reward > 0 ? `+${reward}` : reward}
          </p>
          <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> State value convergence parameter
          </p>
        </div>

        {/* Coverage progress */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Calculated Node Coverage</p>
          <p className="text-3xl font-black text-slate-800 font-mono mt-2">{coverage.toFixed(1)}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${coverage}%` }} />
          </div>
        </div>

        {/* Epsilon Exploration rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Epsilon Decay Rate</p>
          <p className="text-3xl font-black text-slate-800 font-mono mt-2">{(epsilon * 100).toFixed(0)}%</p>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {epsilon > 0.5 ? 'Exploring new state links' : 'Exploiting learned Q-values'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal/Log view */}
        <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-[320px] overflow-hidden shadow-md">
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-blue-500" /> DDQN State exploration console
            </span>
            <span className="text-[9px] font-mono text-emerald-500">SYSTEM: ACTIVE</span>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] text-slate-300">
            {logs.map((log, idx) => (
              <div 
                key={idx} 
                className={`${
                  log.includes('[CRASH') ? 'text-rose-400 bg-rose-950/20 px-1 py-0.5 rounded' :
                  log.includes('[SYSTEM]') ? 'text-blue-400' : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        </div>

        {/* Side Panel: Agent Policy details */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Agent Policy Parameters</h3>
          
          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between pb-2 border-b border-slate-50">
              <span className="text-slate-400">Neural Network Model</span>
              <strong className="text-slate-800 font-semibold">Double-DQN (DDQN)</strong>
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
              <strong className="text-slate-800 font-semibold font-mono">50,000 steps</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Detected Exceptions</span>
              <strong className={`font-semibold font-mono ${detectedCrashes > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                {detectedCrashes} Crashes
              </strong>
            </div>
          </div>

          <div className="bg-amber-50 text-amber-900 p-3 rounded-lg border border-amber-100 text-[11px] leading-relaxed flex gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Coverage limits:</strong> Reinforcement learning agents excel at surface-level exploration but are frequently blocked by modal dialogues or input sequence logic gates. To bypass these, the HRGAF framework uses a <strong>Genetic Algorithm (GA)</strong> to optimize and seed target state populations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
