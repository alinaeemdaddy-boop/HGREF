import { useState, useEffect } from 'react';
import { User, Project, APKInfo, TestCase } from './types';
import { DEFAULT_PROJECTS } from './data/defaultData';
import AuthView from './components/AuthView';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import ApkUploadView from './components/ApkUploadView';
import GuiAnalysisView from './components/GuiAnalysisView';
import RiskClassificationView from './components/RiskClassificationView';
import RlSimulationView from './components/RlSimulationView';
import GaSimulationView from './components/GaSimulationView';
import TestCasesView from './components/TestCasesView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import { ShieldCheck, HelpCircle, Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('hrgaf_user');
    return cached ? JSON.parse(cached) : null;
  });

  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    const cached = localStorage.getItem('hrgaf_projects');
    return cached ? JSON.parse(cached) : DEFAULT_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const cachedActive = localStorage.getItem('hrgaf_active_project_id');
    return cachedActive || (DEFAULT_PROJECTS[0]?.id || '');
  });

  // Sync state with local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('hrgaf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hrgaf_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hrgaf_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('hrgaf_active_project_id', activeProjectId);
  }, [activeProjectId]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hrgaf_user');
  };

  const handleCreateProject = (newProj: Omit<Project, 'id' | 'components' | 'testCases' | 'coverage' | 'crashesCount'>) => {
    const project: Project = {
      ...newProj,
      id: `p_${Date.now()}`,
      components: [],
      testCases: [],
      coverage: 0,
      crashesCount: 0
    };
    setProjects(prev => [...prev, project]);
    setActiveProjectId(project.id);
  };

  const handleEditProject = (updatedProj: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      alert("At least one project context must be maintained in the research workspace.");
      return;
    }
    const filtered = projects.filter(p => p.id !== id);
    setProjects(filtered);
    if (activeProjectId === id) {
      setActiveProjectId(filtered[0].id);
    }
  };

  const handleUpdateProjectApk = (projectId: string, apkInfo: APKInfo) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        // Pre-populate realistic components for demo purposes when a user uploads an apk to custom projects
        const mockComponents = p.id === 'p2' ? p.components : [
          { id: 'c_cust_1', name: 'GestureSwipeHandler', type: 'NavigationScreen' as const, activity: 'MainActivity', riskTier: 1 as const, riskScore: 84, interactionPath: 'Horizontal fling triggers view swap' },
          { id: 'c_cust_2', name: 'LoadServerDataTask', type: 'RecyclerView' as const, activity: 'MainActivity', riskTier: 2 as const, riskScore: 79, interactionPath: 'Fetch and serialize remote json items' },
          { id: 'c_cust_3', name: 'AlertDialogExit', type: 'Dialog' as const, activity: 'MainActivity', riskTier: 3 as const, riskScore: 68, interactionPath: 'Exits current activity dirty states' },
          { id: 'c_cust_4', name: 'OrientationChangeToggle', type: 'Button' as const, activity: 'SettingsActivity', riskTier: 4 as const, riskScore: 40, interactionPath: 'Redraw widgets layout geometry' }
        ];

        return {
          ...p,
          status: 'GUI Analyzed',
          apkInfo,
          components: mockComponents,
          coverage: 15.0
        };
      }
      return p;
    }));
  };

  const handleUpdateProjectStatus = (projectId: string, status: Project['status']) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
  };

  const handleUpdateProjectTraining = (
    projectId: string, 
    coverage: number, 
    episodes: number, 
    crashes: number, 
    history: { episode: number; reward: number; coverage: number }[]
  ) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          coverage,
          status: 'Ready',
          episodesCompleted: episodes,
          crashesCount: crashes,
          rlTrainingHistory: history
        };
      }
      return p;
    }));
  };

  const handleUpdateProjectOptimization = (
    projectId: string, 
    bestFitness: number, 
    generation: number, 
    testCases: TestCase[]
  ) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          bestFitness,
          generation,
          testCases,
          status: 'Ready'
        };
      }
      return p;
    }));
  };

  const handleDeleteTestCase = (projectId: string, testId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          testCases: p.testCases.filter(tc => tc.testId !== testId)
        };
      }
      return p;
    }));
  };

  const handleAddTestCase = (projectId: string, testCase: TestCase) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          testCases: [testCase, ...(p.testCases || [])]
        };
      }
      return p;
    }));
  };

  // If user session is not logged in, render AuthView
  if (!user || !user.isLoggedIn) {
    return <AuthView onLogin={handleLogin} />;
  }

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Helper title for breadcrumb
  const tabTitles: { [key: string]: string } = {
    dashboard: 'Dashboard Overview',
    projects: 'Project Management Workspace',
    upload: 'APK Static Upload & Validation',
    analysis: 'GUI Structure Analysis',
    risk: 'GUI Risk Tier Mapping',
    rl: 'Double-DQN Training Simulator',
    ga: 'Genetic Priority Optimizer',
    'test-cases': 'Generated Prioritized Test Suite',
    reports: 'Thesis Executive Reports',
    settings: 'Framework Hyperparameters'
  };

  return (
    <div id="hrgaf-workspace" className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden cursor-default w-full h-full border-none outline-none"
          aria-label="Close menu backdrop"
        />
      )}

      {/* Sidebar - Desktop and Mobile adaptive wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:sticky lg:z-10 lg:flex shrink-0
        transition-transform duration-300 transform lg:transform-none
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false); // Close sidebar on tap on mobile
          }}
          user={user}
          onLogout={handleLogout}
          projects={projects}
          activeProjectId={activeProjectId}
          setActiveProjectId={setActiveProjectId}
        />
      </div>

      {/* Main Container */}
      <main id="main-content-scroller" className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Panel */}
        <header id="header-bar" className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3.5 shrink-0 flex items-center justify-between sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl lg:hidden transition shrink-0"
              title="Open Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0">
                  HRGAF Core
                </span>
                <span className="text-slate-400 text-[10px] shrink-0">/</span>
                <span className="text-slate-500 text-[11px] font-semibold truncate">{tabTitles[activeTab]}</span>
              </div>
              <h1 className="text-xs md:text-sm font-bold text-slate-800 truncate">
                Active Project Context:&nbsp;
                <span className="text-blue-600">{activeProject.name}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-[10px] md:text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700 hidden sm:inline">Safety Verification Guard Active</span>
              <span className="font-medium text-slate-700 sm:hidden">Guard Active</span>
            </div>
          </div>
        </header>

        {/* Dynamic Views Slot */}
        <div id="views-viewport" className="p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto flex-1 print:p-0 print:m-0 print:max-w-none">
          {activeTab === 'dashboard' && (
            <DashboardView 
              projects={projects} 
              activeProjectId={activeProjectId} 
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              activeProjectId={activeProjectId}
              setActiveProjectId={setActiveProjectId}
              onCreateProject={handleCreateProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeTab === 'upload' && (
            <ApkUploadView
              activeProject={activeProject}
              onUpdateProjectApk={handleUpdateProjectApk}
            />
          )}

          {activeTab === 'analysis' && (
            <GuiAnalysisView
              activeProject={activeProject}
              onUpdateProjectStatus={handleUpdateProjectStatus}
            />
          )}

          {activeTab === 'risk' && (
            <RiskClassificationView
              activeProject={activeProject}
            />
          )}

          {activeTab === 'rl' && (
            <RlSimulationView
              activeProject={activeProject}
              onUpdateProjectTraining={handleUpdateProjectTraining}
            />
          )}

          {activeTab === 'ga' && (
            <GaSimulationView
              activeProject={activeProject}
              onUpdateProjectOptimization={handleUpdateProjectOptimization}
            />
          )}

          {activeTab === 'test-cases' && (
            <TestCasesView
              activeProject={activeProject}
              onDeleteTestCase={handleDeleteTestCase}
              onAddTestCase={handleAddTestCase}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              activeProject={activeProject}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </div>
      </main>
    </div>
  );
}
