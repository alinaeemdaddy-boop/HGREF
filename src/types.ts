export interface User {
  username: string;
  email: string;
  isLoggedIn: boolean;
}

export interface APKInfo {
  packageName: string;
  version: string;
  size: string;
  minSdk: string;
  targetSdk: string;
  uploadDate: string;
  fileName: string;
}

export interface GuiComponent {
  id: string;
  name: string;
  type: 'Activity' | 'Button' | 'TextField' | 'RecyclerView' | 'Dialog' | 'NavigationScreen';
  activity: string;
  riskTier: 1 | 2 | 3 | 4; // Tier 1: Gesture, Tier 2: Runtime, Tier 3: Modal, Tier 4: Context
  riskScore: number; // 0 to 100
  interactionPath?: string;
}

export interface TestCase {
  testId: string;
  screenName: string;
  priority: 'High' | 'Medium' | 'Low';
  riskLevel: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  executionTime: string; // e.g. "1.2s"
  status: 'Passed' | 'Failed' | 'Blocked';
  actions: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  androidVersion: string;
  uploadDate: string;
  status: 'Pending Upload' | 'Analyzing GUI' | 'GUI Analyzed' | 'RL Training' | 'GA Optimizing' | 'Ready';
  apkInfo?: APKInfo;
  components: GuiComponent[];
  testCases: TestCase[];
  coverage: number; // percentage
  crashesCount: number;
  episodesCompleted?: number;
  totalEpisodes?: number;
  bestFitness?: number;
  generation?: number;
  rlTrainingHistory?: { episode: number; reward: number; coverage: number }[];
  gaOptimizationHistory?: { generation: number; bestFitness: number; avgFitness: number }[];
}
