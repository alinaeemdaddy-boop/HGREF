import React, { useState } from 'react';
import { Project } from '../types';
import { 
  FolderPlus, 
  Trash2, 
  Edit3, 
  Eye, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  Layers, 
  FileCheck2, 
  X,
  Target,
  Sparkles,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectsViewProps {
  projects: Project[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  onCreateProject: (project: Omit<Project, 'id' | 'components' | 'testCases' | 'coverage' | 'crashesCount'>) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectsView({
  projects,
  activeProjectId,
  setActiveProjectId,
  onCreateProject,
  onEditProject,
  onDeleteProject
}: ProjectsViewProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [androidVersion, setAndroidVersion] = useState('Android 13.0 (API 33)');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<Project | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenCreateModal = () => {
    setName('');
    setDescription('');
    setAndroidVersion('Android 13.0 (API 33)');
    setIsCreateModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    const today = new Date().toISOString().split('T')[0];
    onCreateProject({
      name,
      description,
      androidVersion,
      uploadDate: today,
      status: 'Pending Upload'
    });
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (p: Project) => {
    setEditingProject(p);
    setName(p.name);
    setDescription(p.description);
    setAndroidVersion(p.androidVersion);
    setIsEditModalOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !name || !description) return;
    onEditProject({
      ...editingProject,
      name,
      description,
      androidVersion
    });
    setIsEditModalOpen(false);
  };

  const handleOpenDetails = (p: Project) => {
    setSelectedProjectDetails(p);
    setIsDetailsModalOpen(true);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="projects-view" className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Management</h2>
          <p className="text-xs text-slate-400">Manage Android APK test workspaces and workspace credentials</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Research Project</span>
        </button>
      </div>

      {/* Search and context notification */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-xs text-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((p) => {
          const isActive = p.id === activeProjectId;
          return (
            <div
              key={p.id}
              className={`bg-white border rounded-xl p-5 shadow-sm transition flex flex-col justify-between ${
                isActive ? 'border-blue-500 ring-1 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {p.name}
                      {isActive && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          Active Context
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                    p.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' :
                    p.status === 'GUI Analyzed' ? 'bg-amber-100 text-amber-800' :
                    p.status === 'Pending Upload' ? 'bg-slate-100 text-slate-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {p.status}
                  </span>
                </div>

                {/* Project Specs */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-50 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{p.androidVersion}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Created {p.uploadDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-slate-400" />
                    <span>{p.components.length} Components</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileCheck2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>{p.testCases.length} Test Cases</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveProjectId(p.id)}
                  disabled={isActive}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                    isActive 
                      ? 'bg-slate-50 text-slate-400 cursor-default'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {isActive ? 'Currently Active' : 'Set Active Context'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenDetails(p)}
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition"
                    title="Edit metadata"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteProject(p.id)}
                    className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Project */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Create Research Project</h3>
                <p className="text-[11px] text-slate-400">Initialize a new test framework context for Android GUI testing</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. FitKeep Tracker"
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the target application features..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Android SDK Version</label>
                <select
                  value={androidVersion}
                  onChange={(e) => setAndroidVersion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Android 14.0 (API 34)">Android 14.0 (API 34 - Upside Down Cake)</option>
                  <option value="Android 13.0 (API 33)">Android 13.0 (API 33 - Tiramisu)</option>
                  <option value="Android 12.0 (API 31)">Android 12.0 (API 31 - S)</option>
                  <option value="Android 11.0 (API 30)">Android 11.0 (API 30 - R)</option>
                  <option value="Android 10.0 (API 29)">Android 10.0 (API 29 - Q)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Project */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Research Project</h3>
                <p className="text-[11px] text-slate-400">Update metadata parameters</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Android SDK Version</label>
                <select
                  value={androidVersion}
                  onChange={(e) => setAndroidVersion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Android 14.0 (API 34)">Android 14.0 (API 34 - Upside Down Cake)</option>
                  <option value="Android 13.0 (API 33)">Android 13.0 (API 33 - Tiramisu)</option>
                  <option value="Android 12.0 (API 31)">Android 12.0 (API 31 - S)</option>
                  <option value="Android 11.0 (API 30)">Android 11.0 (API 30 - R)</option>
                  <option value="Android 10.0 (API 29)">Android 10.0 (API 29 - Q)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Project Details */}
      {isDetailsModalOpen && selectedProjectDetails && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-xl relative max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            
            <div className="space-y-5">
              <div>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  Research Specification
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedProjectDetails.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedProjectDetails.description}</p>
              </div>

              {/* APK Spec Section */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-blue-600" /> Attached APK Meta-information
                </h4>
                {selectedProjectDetails.apkInfo ? (
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div><strong>Package Name:</strong> <span className="font-mono">{selectedProjectDetails.apkInfo.packageName}</span></div>
                    <div><strong>App Version:</strong> {selectedProjectDetails.apkInfo.version}</div>
                    <div><strong>APK Size:</strong> {selectedProjectDetails.apkInfo.size}</div>
                    <div><strong>Target SDK:</strong> {selectedProjectDetails.apkInfo.targetSdk}</div>
                    <div className="col-span-2"><strong>Uploaded File:</strong> <span className="font-mono text-[11px] bg-slate-200/50 px-1.5 py-0.5 rounded">{selectedProjectDetails.apkInfo.fileName}</span></div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No APK has been uploaded to this project workspace yet.</p>
                )}
              </div>

              {/* Research Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                  <p className="text-xs font-semibold text-slate-500">Coverage Achieved</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono">{selectedProjectDetails.coverage.toFixed(1)}%</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                  <p className="text-xs font-semibold text-slate-500">Crashes Found</p>
                  <p className="text-lg font-bold text-rose-600 mt-0.5 font-mono">{selectedProjectDetails.crashesCount}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                  <p className="text-xs font-semibold text-slate-500">Status</p>
                  <p className="text-xs font-bold text-blue-600 mt-2.5 uppercase tracking-wider">{selectedProjectDetails.status}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProjectId(selectedProjectDetails.id);
                    setIsDetailsModalOpen(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  Set as Active Context
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
