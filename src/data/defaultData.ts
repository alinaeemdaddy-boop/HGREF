import { Project, GuiComponent, TestCase } from '../types';

export const DEFAULT_COMPONENTS_OPENTASKS: GuiComponent[] = [
  // Tier 1: Gesture Sensitive
  { id: 'c1', name: 'TaskSwipeDismissListener', type: 'NavigationScreen', activity: 'MainActivity', riskTier: 1, riskScore: 88, interactionPath: 'Drag task item horizontally to delete' },
  { id: 'c2', name: 'TaskPriorityReorderHandle', type: 'Button', activity: 'MainActivity', riskTier: 1, riskScore: 82, interactionPath: 'Long press and drag vertically to reorder tasks' },
  
  // Tier 2: Runtime Loaded
  { id: 'c3', name: 'CategoryFilterSpinner', type: 'RecyclerView', activity: 'MainActivity', riskTier: 2, riskScore: 74, interactionPath: 'Fetch categories from local DB & populate list' },
  { id: 'c4', name: 'AttachmentGridLoader', type: 'RecyclerView', activity: 'TaskDetailActivity', riskTier: 2, riskScore: 71, interactionPath: 'Load images asynchronously from storage' },
  
  // Tier 3: Modal Interruptive
  { id: 'c5', name: 'DiscardChangesDialog', type: 'Dialog', activity: 'TaskDetailActivity', riskTier: 3, riskScore: 65, interactionPath: 'Triggered when exiting dirty edit state' },
  { id: 'c6', name: 'DueDateCalendarPicker', type: 'Dialog', activity: 'TaskDetailActivity', riskTier: 3, riskScore: 62, interactionPath: 'Modal bottom sheet date selection' },

  // Tier 4: Context Aware
  { id: 'c7', name: 'LocationReminderTrigger', type: 'Button', activity: 'TaskDetailActivity', riskTier: 4, riskScore: 54, interactionPath: 'Check coarse location permissions & show maps' },
  { id: 'c8', name: 'DarkModeToggle', type: 'Button', activity: 'SettingsActivity', riskTier: 4, riskScore: 45, interactionPath: 'Recreate activity theme upon click' },

  // General Components
  { id: 'c9', name: 'AddTaskFab', type: 'Button', activity: 'MainActivity', riskTier: 3, riskScore: 50, interactionPath: 'Launches TaskDetailActivity in creation mode' },
  { id: 'c10', name: 'TaskTitleInput', type: 'TextField', activity: 'TaskDetailActivity', riskTier: 4, riskScore: 30, interactionPath: 'Accepts alphanumeric text up to 100 chars' }
];

export const DEFAULT_TESTCASES_OPENTASKS: TestCase[] = [
  { testId: 'TC-OT-01', screenName: 'MainActivity', priority: 'High', riskLevel: 'Tier 1', executionTime: '1.4s', status: 'Passed', actions: ['Launch App', 'Swipe left on task "Buy Milk"', 'Confirm Discard Dialog', 'Verify Task Removed'] },
  { testId: 'TC-OT-02', screenName: 'TaskDetailActivity', priority: 'High', riskLevel: 'Tier 2', executionTime: '2.1s', status: 'Failed', actions: ['Click AddTaskFab', 'Type "Meeting" in TaskTitleInput', 'Click AttachmentButton', 'Load corrupted .bin attachment', 'Verify App Crash'] },
  { testId: 'TC-OT-03', screenName: 'TaskDetailActivity', priority: 'Medium', riskLevel: 'Tier 3', executionTime: '1.8s', status: 'Passed', actions: ['Click Task Item', 'Click DueDateCalendarPicker', 'Select Date: 2026-07-15', 'Verify Date Updated'] },
  { testId: 'TC-OT-04', screenName: 'MainActivity', priority: 'Medium', riskLevel: 'Tier 1', executionTime: '1.2s', status: 'Passed', actions: ['Long press task item #1', 'Drag below task item #3', 'Verify priority order in DB'] },
  { testId: 'TC-OT-05', screenName: 'SettingsActivity', priority: 'Low', riskLevel: 'Tier 4', executionTime: '0.9s', status: 'Passed', actions: ['Open Sidebar', 'Click Settings', 'Toggle DarkModeToggle', 'Verify theme change'] },
  { testId: 'TC-OT-06', screenName: 'TaskDetailActivity', priority: 'High', riskLevel: 'Tier 4', executionTime: '2.4s', status: 'Failed', actions: ['Click Task Item', 'Click LocationReminderTrigger', 'Deny permission popup', 'Verify Location Reminders gracefully disabled'] }
];

export const DEFAULT_COMPONENTS_FITKEEP: GuiComponent[] = [
  // Tier 1: Gesture Sensitive
  { id: 'c20', name: 'HeartRatePulseSwiper', type: 'NavigationScreen', activity: 'DashboardActivity', riskTier: 1, riskScore: 92, interactionPath: 'Pinch-to-zoom heart rate history graph' },
  { id: 'c21', name: 'WorkoutScrollSelector', type: 'RecyclerView', activity: 'WorkoutSessionActivity', riskTier: 1, riskScore: 85, interactionPath: 'Horizontal flick list to choose sport type' },
  
  // Tier 2: Runtime Loaded
  { id: 'c22', name: 'GoogleFitSyncTrigger', type: 'Button', activity: 'DashboardActivity', riskTier: 2, riskScore: 78, interactionPath: 'REST API call to fetch health store indicators' },
  { id: 'c23', name: 'LiveSensorStreamView', type: 'RecyclerView', activity: 'WorkoutSessionActivity', riskTier: 2, riskScore: 80, interactionPath: 'Binds active BLE heart rate sensor data stream' },

  // Tier 3: Modal Interruptive
  { id: 'c24', name: 'SensorConnectDialog', type: 'Dialog', activity: 'WorkoutSessionActivity', riskTier: 3, riskScore: 70, interactionPath: 'Alert dialog scanning and listing nearby Bluetooth devices' },
  { id: 'c25', name: 'TargetAchievedCelebrationDialog', type: 'Dialog', activity: 'DashboardActivity', riskTier: 3, riskScore: 68, interactionPath: 'Congratulatory modal with physics particle layout' },

  // Tier 4: Context Aware
  { id: 'c26', name: 'GpsRouteTracker', type: 'NavigationScreen', activity: 'WorkoutSessionActivity', riskTier: 4, riskScore: 61, interactionPath: 'Requests high-accuracy background location' },
  { id: 'c27', name: 'WeightInputForm', type: 'TextField', activity: 'ProfileActivity', riskTier: 4, riskScore: 35, interactionPath: 'Validates floating point numbers in metric/imperial' }
];

export const DEFAULT_TESTCASES_FITKEEP: TestCase[] = [
  { testId: 'TC-FK-01', screenName: 'DashboardActivity', priority: 'High', riskLevel: 'Tier 1', executionTime: '1.6s', status: 'Passed', actions: ['Launch App', 'Pinch-zoom HeartRatePulseSwiper', 'Verify scale adjustments'] },
  { testId: 'TC-FK-02', screenName: 'WorkoutSessionActivity', priority: 'High', riskLevel: 'Tier 2', executionTime: '2.5s', status: 'Passed', actions: ['Click Start Workout', 'Open SensorConnectDialog', 'Select simulated BLE device', 'Verify heart rate displays'] },
  { testId: 'TC-FK-03', screenName: 'WorkoutSessionActivity', priority: 'Medium', riskLevel: 'Tier 4', executionTime: '3.1s', status: 'Passed', actions: ['Start Run Session', 'Simulate GPS movement (latitude shifts)', 'Verify live distance incrementing'] },
  { testId: 'TC-FK-04', screenName: 'ProfileActivity', priority: 'Low', riskLevel: 'Tier 4', executionTime: '1.1s', status: 'Passed', actions: ['Open Profile', 'Type "abc" inside WeightInputForm', 'Click Save', 'Verify invalid input warning'] }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'OpenTasks Manager',
    description: 'A versatile task planning and task synchronization utility with cloud sync options, tag structures, and swipe controls.',
    androidVersion: 'Android 13.0 (API 33)',
    uploadDate: '2026-06-15',
    status: 'Ready',
    apkInfo: {
      packageName: 'org.opentasks.app',
      version: '2.4.1',
      size: '8.4 MB',
      minSdk: 'API 21 (Lollipop)',
      targetSdk: 'API 33 (Tiramisu)',
      uploadDate: '2026-06-15',
      fileName: 'opentasks_v2.4.1_release.apk'
    },
    components: DEFAULT_COMPONENTS_OPENTASKS,
    testCases: DEFAULT_TESTCASES_OPENTASKS,
    coverage: 84.5,
    crashesCount: 2,
    episodesCompleted: 1000,
    totalEpisodes: 1000,
    bestFitness: 0.942,
    generation: 100,
    rlTrainingHistory: [
      { episode: 0, reward: -150, coverage: 12 },
      { episode: 100, reward: -80, coverage: 25 },
      { episode: 200, reward: -20, coverage: 40 },
      { episode: 300, reward: 35, coverage: 52 },
      { episode: 400, reward: 88, coverage: 65 },
      { episode: 500, reward: 120, coverage: 71 },
      { episode: 600, reward: 165, coverage: 75 },
      { episode: 700, reward: 210, coverage: 79 },
      { episode: 800, reward: 235, coverage: 82 },
      { episode: 900, reward: 245, coverage: 84 },
      { episode: 1000, reward: 252, coverage: 84.5 }
    ],
    gaOptimizationHistory: [
      { generation: 0, bestFitness: 0.42, avgFitness: 0.28 },
      { generation: 10, bestFitness: 0.58, avgFitness: 0.41 },
      { generation: 20, bestFitness: 0.69, avgFitness: 0.53 },
      { generation: 30, bestFitness: 0.77, avgFitness: 0.61 },
      { generation: 40, bestFitness: 0.81, avgFitness: 0.68 },
      { generation: 50, bestFitness: 0.85, avgFitness: 0.72 },
      { generation: 60, bestFitness: 0.88, avgFitness: 0.75 },
      { generation: 70, bestFitness: 0.91, avgFitness: 0.78 },
      { generation: 80, bestFitness: 0.92, avgFitness: 0.81 },
      { generation: 90, bestFitness: 0.935, avgFitness: 0.83 },
      { generation: 100, bestFitness: 0.942, avgFitness: 0.85 }
    ]
  },
  {
    id: 'p2',
    name: 'FitKeep Health Tracker',
    description: 'An active calorie tracker and sport logger syncing BLE wearable devices and managing real-time heart rate charting.',
    androidVersion: 'Android 14.0 (API 34)',
    uploadDate: '2026-06-28',
    status: 'GUI Analyzed',
    apkInfo: {
      packageName: 'com.fitkeep.tracker',
      version: '1.0.8',
      size: '14.2 MB',
      minSdk: 'API 26 (Oreo)',
      targetSdk: 'API 34 (Upside Down Cake)',
      uploadDate: '2026-06-28',
      fileName: 'fitkeep_health_tracker_v1.0.8.apk'
    },
    components: DEFAULT_COMPONENTS_FITKEEP,
    testCases: [],
    coverage: 15.0,
    crashesCount: 0,
    episodesCompleted: 0,
    totalEpisodes: 800,
    bestFitness: 0,
    generation: 0,
    rlTrainingHistory: [],
    gaOptimizationHistory: []
  }
];
