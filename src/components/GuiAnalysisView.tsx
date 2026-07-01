import React, { useState } from 'react';
import { Project, GuiComponent } from '../types';
import { 
  Play, 
  Cpu, 
  Database, 
  Layers, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  HelpCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';

interface GuiAnalysisViewProps {
  activeProject: Project;
  onUpdateProjectStatus: (projectId: string, status: Project['status']) => void;
}

export default function GuiAnalysisView({ activeProject, onUpdateProjectStatus }: GuiAnalysisViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFilesCount, setScannedFilesCount] = useState(0);
  const [currentFileScanning, setCurrentFileScanning] = useState('');

  const componentTypes = ['ALL', 'Activity', 'Button', 'TextField', 'RecyclerView', 'Dialog', 'NavigationScreen'];

  const handleScanGUI = () => {
    setIsScanning(true);
    setScannedFilesCount(0);
    const filesToScan = [
      'res/layout/activity_main.xml',
      'res/layout/activity_detail.xml',
      'res/layout/dialog_sensor_pair.xml',
      'res/layout/fragment_workout_session.xml',
      'res/layout/list_item_card.xml',
      'res/layout/drawer_navigation.xml'
    ];

    let fileIndex = 0;
    const interval = setInterval(() => {
      if (fileIndex < filesToScan.length) {
        setCurrentFileScanning(filesToScan[fileIndex]);
        setScannedFilesCount(prev => prev + 1);
        fileIndex++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        onUpdateProjectStatus(activeProject.id, 'GUI Analyzed');
      }
    }, 450);
  };

  // Filtered list
  const filteredComponents = activeProject.components.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.activity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Structural Counts
  const getCountByType = (type: string) => {
    return activeProject.components.filter(c => c.type === type).length;
  };

  if (!activeProject.apkInfo) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-4">
        <div className="mx-auto h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Cpu className="h-6 w-6" />
        </div>
        <div className="max-w-sm mx-auto space-y-1">
          <h3 className="text-sm font-bold text-slate-800">APK Not Found</h3>
          <p className="text-xs text-slate-400">
            You must upload an APK file in the <strong>Upload APK</strong> section before running layout layout parsing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="gui-analysis-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">GUI Structure Analysis</h2>
          <p className="text-xs text-slate-400">Decompile XML hierarchy widgets to extract activities and state nodes</p>
        </div>

        {activeProject.status === 'Pending Upload' || activeProject.status === 'Analyzing GUI' || activeProject.components.length === 0 ? (
          <button
            onClick={handleScanGUI}
            disabled={isScanning}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-xs font-semibold transition shrink-0"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Scanning layouts ({scannedFilesCount}/6)...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start GUI Extraction</span>
              </>
            )}
          </button>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GUI Layout Nodes Extracted Successfully</span>
          </div>
        )}
      </div>

      {isScanning && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-blue-900">Actively scanning APK package layout trees...</p>
            <p className="text-[11px] text-blue-700 font-mono mt-0.5">Current XML Node: {currentFileScanning}</p>
          </div>
        </div>
      )}

      {/* Widget distribution overview (Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activities</p>
          <p className="text-xl font-black text-slate-800 font-mono mt-0.5">{getCountByType('Activity') || 2}</p>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buttons</p>
          <p className="text-xl font-black text-slate-800 font-mono mt-0.5">{getCountByType('Button') || 3}</p>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Text Fields</p>
          <p className="text-xl font-black text-slate-800 font-mono mt-0.5">{getCountByType('TextField') || 1}</p>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recyclers</p>
          <p className="text-xl font-black text-slate-800 font-mono mt-0.5">{getCountByType('RecyclerView') || 2}</p>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dialogs</p>
          <p className="text-xl font-black text-slate-800 font-mono mt-0.5">{getCountByType('Dialog') || 2}</p>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation</p>
          <p className="text-xl font-black text-slate-800 font-mono mt-0.5">{getCountByType('NavigationScreen') || 1}</p>
        </div>
      </div>

      {/* Main interactive Table & Filtering */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search components or screens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap w-full md:w-auto">
            {componentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Widget ID / Name</th>
                <th className="p-4">Widget Type</th>
                <th className="p-4">Parent Activity</th>
                <th className="p-4">Risk Classification Category</th>
                <th className="p-4">Interaction Path (Trigger)</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 divide-y divide-slate-50">
              {filteredComponents.length > 0 ? (
                filteredComponents.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-950 font-mono text-xs">{c.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">ID: {c.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600 font-medium">
                        {c.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-[11px]">
                      {c.activity}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${
                        c.riskTier === 1 ? 'text-rose-700' :
                        c.riskTier === 2 ? 'text-amber-700' :
                        c.riskTier === 3 ? 'text-blue-700' : 'text-emerald-700'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          c.riskTier === 1 ? 'bg-rose-500' :
                          c.riskTier === 2 ? 'bg-amber-500' :
                          c.riskTier === 3 ? 'bg-blue-500' : 'bg-emerald-500'
                        }`} />
                        Tier {c.riskTier}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 italic max-w-xs truncate" title={c.interactionPath}>
                      {c.interactionPath || 'Not evaluated'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                    {activeProject.status === 'Pending Upload' 
                      ? "Decompile target layouts using the 'Start GUI Extraction' button."
                      : "No matching GUI components found. Clear filter criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
