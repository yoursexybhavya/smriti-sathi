export type Language = 'en' | 'as' | 'brx' | 'mni';

export interface Translations {
  // App
  appName: string;
  appTagline: string;

  // Navigation
  home: string;
  games: string;
  reminders: string;
  settings: string;
  caregiver: string;
  myBrain: string;

  // Header & Status
  hi: string;
  welcomeBack: string;
  points: string;
  streak: string;
  dailyActiveStreak: string;
  cognitiveIndex: string;
  voiceGuide: string;
  switchProfile: string;

  // Home Screen
  firstWorkout: string;
  todaysRoutine: string;
  workoutCount: (current: number, total: number) => string;
  start: string;
  continueWorkout: string;
  workoutDesc: string;
  todaysExercises: string;
  speedMatchTitle: string;
  speedMatchSubtitle: string;
  masterpieceTitle: string;
  masterpieceSubtitle: string;
  mathWorkoutSubtitle: string;
  languageWorkoutSubtitle: string;
  ebbFlowTitle: string;
  ebbFlowSubtitle: string;
  trainOfThoughtTitle: string;
  trainOfThoughtSubtitle: string;
  moreWorkouts: string;
  allIncludedOffline: string;
  mathEstimation: string;
  mathDesc: string;
  languageBhashini: string;
  languageDesc: string;
  favorites: string;
  favoritesDesc: string;
  strengthen: string;
  strengthenDesc: string;
  quickRoutine: string;
  quickDesc: string;
  playNow: string;
  clinicalEvidenceTitle: string;
  clinicalEvidenceDesc: string;

  // Games General
  memoryMatch: string;
  memoryMatchDesc: string;
  dailyRoutine: string;
  dailyRoutineDesc: string;
  startGame: string;
  level: string;
  score: string;
  greatJob: string;
  wellDone: string;
  keepGoing: string;
  tryAgain: string;
  gameComplete: string;
  playAgain: string;
  backToHome: string;

  // Memory Match specific
  findThePairs: string;
  pairsFound: string;
  attempts: string;

  // Daily Routine specific
  orderYourDay: string;
  putInOrder: string;
  correctOrder: string;
  wakeUp: string;
  brushTeeth: string;
  breakfast: string;
  takeMedicine: string;
  morningWalk: string;
  lunch: string;
  rest: string;
  eveningTea: string;
  dinner: string;
  sleep: string;

  // Reminders
  medicine: string;
  water: string;
  activity: string;
  appointment: string;
  timeForMedicine: string;
  timeForWater: string;
  timeForActivity: string;
  reminderAcknowledged: string;
  addReminder: string;
  noReminders: string;
  dismiss: string;

  // Caregiver / My Brain
  caregiverDashboard: string;
  engagementSummary: string;
  gamesPlayed: string;
  totalTime: string;
  accuracy: string;
  reminderAdherence: string;
  performanceTrend: string;
  noDataYet: string;
  lastDays: string;
  alerts: string;
  noAlerts: string;

  // Profiles & Accounts
  elderProfile: string;
  allProfiles: string;
  activeProfile: string;
  addProfile: string;
  createNewProfile: string;
  elderNameLabel: string;
  ageLabel: string;
  nativeLanguageLabel: string;
  saveProfile: string;
  cancel: string;
  edit: string;
  delete: string;
  registeredCare: string;

  // Settings & Accessibility
  language: string;
  textSize: string;
  normal: string;
  large: string;
  standardText: string;
  largeText: string;
  regionalLanguage: string;
  regionalLanguageDesc: string;
  accessibility: string;
  textScaling: string;
  dpdpCompliance: string;
  dpdpDesc: string;
  consent: string;
  consentGranted: string;
  revokeConsent: string;
  grantConsent: string;
  consentActive: string;
  consentRevoked: string;
  revoke: string;
  grant: string;

  // Updates
  appUpdates: string;
  checkForUpdates: string;
  checkingUpdates: string;
  upToDate: string;
  updateAvailableBanner: string;
  downloadUpdate: string;
  version: string;

  // Domain Scores & Zero-Baseline
  domainMemory: string;
  domainMemoryDesc: string;
  domainRoutine: string;
  domainRoutineDesc: string;
  domainAttention: string;
  domainAttentionDesc: string;
  domainSpeed: string;
  domainSpeedDesc: string;
  domainCalculation: string;
  domainCalculationDesc: string;
  domainLanguage: string;
  domainLanguageDesc: string;
  notTestedYet: string;
  playToTestDomain: string;
  dailyGoalProgress: (current: number, total: number) => string;
  resetAllData: string;
  resetAllDataDesc: string;
  resetDataConfirm: string;
  resetDataSuccess: string;

  // Dashboard & Caregiver Tabs
  lpiIndexTab: string;
  progressTab: string;
  caregiverTab: string;
  familySyncTab: string;
  privacyTab: string;
  overallSpiScore: string;
  spiScoreDesc: string;
  ashaObservationsTitle: string;
  ashaObs1: string;
  ashaObs2: string;
  ashaObs3: string;
  historicalAccuracyTrend: string;
  last10Sessions: string;
  noPlayDataYet: string;
  cognitiveStabilityCurve: string;
  stable: string;
  stabilityDesc: string;

  // GamesHub & Workouts
  evidenceBasedWorkouts: string;
  dailyRecommendation: string;
  coreCognitiveDomains: string;
  northEastHeritage: string;
  northEastHeritageDesc: string;

  // In-App Update Modal
  updateModalTitle: string;
  updateModalDesc: string;
  installUpdateNow: string;
  updateDismiss: string;
  updateCheckPrompt: string;
  noUpdateFound: string;

  // Family Account & Pairing
  familyLink: string;
  familyAccountTitle: string;
  familyAccountDesc: string;
  elderSyncCode: string;
  childPhoneLabel: string;
  caregiverNameLabel: string;
  pairAccountBtn: string;
  pairedSuccess: string;
  shareWhatsappReport: string;
  cloudSyncNow: string;
}

const en: Translations = {
  appName: 'Smriti Sathi',
  appTagline: 'Memory care that speaks your language — online or offline',
  home: 'Home',
  games: 'Games',
  reminders: 'Reminders',
  settings: 'Settings',
  caregiver: 'Caregiver',
  myBrain: 'My Brain',

  hi: 'Hi',
  welcomeBack: 'Welcome back',
  points: 'Points',
  streak: 'Streak',
  dailyActiveStreak: 'Daily Active Streak',
  cognitiveIndex: 'Cognitive Performance Index (CPI)',
  voiceGuide: 'Voice Guide',
  switchProfile: 'Switch Profile',

  firstWorkout: 'Your First Workout',
  todaysRoutine: "Today's Cognitive Routine",
  workoutCount: (current, total) => `Workout ${current} of ${total}`,
  start: 'Start',
  continueWorkout: 'Continue Workout',
  workoutDesc: "Each game exercises a different domain of your thinking. Let's give them all a try.",
  todaysExercises: "Today's Exercises",
  speedMatchTitle: 'Speed Match',
  speedMatchSubtitle: 'WORKING MEMORY',
  masterpieceTitle: 'Masterpiece (Daily Routine)',
  masterpieceSubtitle: 'TEMPORAL ORIENTATION',
  mathWorkoutSubtitle: 'PROCESSING SPEED',
  languageWorkoutSubtitle: 'ATTENTION & FOCUS',
  ebbFlowTitle: 'Ebb and Flow (Reminiscence)',
  ebbFlowSubtitle: 'FLEXIBILITY • HERITAGE',
  trainOfThoughtTitle: 'Train of Thought (Routine & Meds)',
  trainOfThoughtSubtitle: 'ATTENTION • DAILY SCHEDULE',
  moreWorkouts: 'More Workouts',
  allIncludedOffline: 'ALL INCLUDED • OFFLINE',
  mathEstimation: 'Math & Estimation',
  mathDesc: 'Challenge your estimation, counting, and everyday grocery currency skills.',
  languageBhashini: 'Language (Bhashini AI)',
  languageDesc: 'Explore Assamese, Bodo, and Manipuri proverbs, vocabulary, and stories.',
  favorites: 'Favorites',
  favoritesDesc: 'Treat your brain to the cognitive care games you enjoy playing the most.',
  strengthen: 'Strengthen (Errorless Care)',
  strengthenDesc: 'Gentle guided practice that boosts confidence and prevents cognitive frustration.',
  quickRoutine: 'Quick Routine',
  quickDesc: 'Short, calm memory exercises in 5 minutes or less.',
  playNow: 'PLAY NOW →',
  clinicalEvidenceTitle: 'Evidence-Based Cognitive Stimulation',
  clinicalEvidenceDesc: 'Built on Cochrane-reviewed Cognitive Stimulation Therapy (CST) and errorless learning principles, specifically tuned for low-connectivity care in the North Eastern Region.',

  memoryMatch: 'Memory Match',
  memoryMatchDesc: 'Find matching pairs of cards',
  dailyRoutine: 'Daily Routine',
  dailyRoutineDesc: 'Put your daily activities in order',
  startGame: 'Start Game',
  level: 'Level',
  score: 'Score',
  greatJob: 'Great job!',
  wellDone: 'Well done!',
  keepGoing: 'Keep going, you are doing well!',
  tryAgain: 'Almost there! Try once more',
  gameComplete: 'Game Complete!',
  playAgain: 'Play Again',
  backToHome: 'Back to Home',
  findThePairs: 'Find the matching pairs',
  pairsFound: 'Pairs found',
  attempts: 'Attempts',
  orderYourDay: 'Order Your Day',
  putInOrder: 'Put these activities in the right order',
  correctOrder: 'That is the correct order!',
  wakeUp: 'Wake Up',
  brushTeeth: 'Brush Teeth',
  breakfast: 'Breakfast',
  takeMedicine: 'Take Medicine',
  morningWalk: 'Morning Walk',
  lunch: 'Lunch',
  rest: 'Rest',
  eveningTea: 'Evening Tea',
  dinner: 'Dinner',
  sleep: 'Sleep',

  medicine: 'Medicine',
  water: 'Water',
  activity: 'Activity',
  appointment: 'Appointment',
  timeForMedicine: 'Time for your medicine',
  timeForWater: 'Time to drink water',
  timeForActivity: 'Time for your brain games!',
  reminderAcknowledged: 'Done!',
  addReminder: 'Add Reminder',
  noReminders: 'No reminders set',
  dismiss: 'Dismiss',

  caregiverDashboard: 'Caregiver Dashboard',
  engagementSummary: 'Engagement Summary',
  gamesPlayed: 'Games Played',
  totalTime: 'Total Time',
  accuracy: 'Accuracy',
  reminderAdherence: 'Reminder Adherence',
  performanceTrend: 'Performance Trend',
  noDataYet: 'No data yet. Play some games to see trends!',
  lastDays: 'Last 7 days',
  alerts: 'Alerts',
  noAlerts: 'No alerts — everything looks good!',

  elderProfile: 'Elder Profile',
  allProfiles: 'Registered Elders',
  activeProfile: 'Active Elder',
  addProfile: 'Add Elder Profile',
  createNewProfile: 'Register New Elder',
  elderNameLabel: "Elder's Name (e.g. Baa / Krishna)",
  ageLabel: 'Age',
  nativeLanguageLabel: 'Primary Language',
  saveProfile: 'Save Profile',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  registeredCare: 'Registered for Daily Dementia Cognitive Care',

  language: 'Language',
  textSize: 'Text Size',
  normal: 'Standard',
  large: 'Large',
  standardText: 'Standard',
  largeText: '🔍 Large Text (Elderly)',
  regionalLanguage: 'REGIONAL LANGUAGE (BHASHINI AI)',
  regionalLanguageDesc: 'Powers text-to-speech instructions, proverbs, and game audio in your native tongue:',
  accessibility: 'ACCESSIBILITY',
  textScaling: 'Visual Text Scaling',
  dpdpCompliance: 'DPDP ACT 2023 COMPLIANCE',
  dpdpDesc: 'Data is stored locally on this Android device. All patient telemetry is revocable by the designated family caregiver.',
  consent: 'Data Consent',
  consentGranted: 'You have given consent to store your activity data',
  revokeConsent: 'Revoke Consent',
  grantConsent: 'Grant Consent',
  consentActive: '✓ Consent Active (DPDP Validated)',
  consentRevoked: '✕ Consent Revoked',
  revoke: 'Revoke',
  grant: 'Grant',

  appUpdates: 'APPLICATION UPDATES',
  checkForUpdates: 'Check for Updates',
  checkingUpdates: 'Checking for updates...',
  upToDate: '✓ Smriti Sathi is up to date',
  updateAvailableBanner: '🚀 New Update Available!',
  downloadUpdate: 'Download & Install APK',
  version: 'Version',

  domainMemory: 'Memory',
  domainMemoryDesc: 'Visual pairs & card recall',
  domainRoutine: 'Routine Orientation',
  domainRoutineDesc: 'Chronological daily timeline',
  domainAttention: 'Attention & Focus',
  domainAttentionDesc: 'Continuous concentration',
  domainSpeed: 'Speed & Reflexes',
  domainSpeedDesc: 'Gentle response latency',
  domainCalculation: 'Math & Calculation',
  domainCalculationDesc: 'Everyday grocery currency estimation',
  domainLanguage: 'Language & Recall',
  domainLanguageDesc: 'Cultural proverbs and heritage vocabulary',
  notTestedYet: 'Not Tested Yet',
  playToTestDomain: 'Play a game to measure this domain',
  dailyGoalProgress: (current, total) => `Today's Goal: ${current} / ${total} Workouts`,
  resetAllData: 'Reset All Data to 0',
  resetAllDataDesc: 'Wipe all test scores and history to start fresh with a true 0-baseline.',
  resetDataConfirm: 'Are you sure? This will delete all gameplay logs and reset points to 0.',
  resetDataSuccess: '✓ All data reset to 0 successfully!',

  lpiIndexTab: 'SPI INDEX',
  progressTab: 'PROGRESS',
  caregiverTab: 'ASHA / CAREGIVER',
  familySyncTab: 'PARENT-CHILD SYNC 📲',
  privacyTab: 'DPDP PRIVACY',
  overallSpiScore: 'Overall SPI Score',
  spiScoreDesc: 'Calculated across working memory, routine sequencing, and daily recall exercises.',
  ashaObservationsTitle: 'ASHA Health Worker Observations',
  ashaObs1: 'Engagement Adherence: Daily CST mental exercise completed on schedule.',
  ashaObs2: 'Adaptive Progression: Staircase engine successfully maintains confidence.',
  ashaObs3: 'Family Note: Routine sequencing demonstrates high stability.',
  historicalAccuracyTrend: 'Historical Accuracy Trend',
  last10Sessions: 'Last 10 Sessions',
  noPlayDataYet: 'No play data yet. Play your first workout to see cognitive trends!',
  cognitiveStabilityCurve: 'COGNITIVE STABILITY CURVE',
  stable: 'STABLE',
  stabilityDesc: 'Tracking demonstrates consistent cognitive maintenance without abnormal regression.',

  evidenceBasedWorkouts: 'Evidence-based cognitive workouts designed for gentle elderly care',
  dailyRecommendation: 'DAILY RECOMMENDATION',
  coreCognitiveDomains: 'CORE COGNITIVE DOMAINS',
  northEastHeritage: 'NORTH EAST HERITAGE & REMINISCENCE',
  northEastHeritageDesc: 'Cultural anchors and music traditions of Assam, Bodo Territorial Region, and Manipur',

  updateModalTitle: '🚀 New Update Available!',
  updateModalDesc: 'A newer, improved version of Smriti Sathi is ready to install with better language support and dementia care enhancements.',
  installUpdateNow: 'Install Update Now',
  updateDismiss: 'Later',
  updateCheckPrompt: 'Checking GitHub for updates...',
  noUpdateFound: 'You are on the latest version of Smriti Sathi!',

  // Family Account & Pairing
  familyLink: 'Family Link',
  familyAccountTitle: 'Family Account & Pairing',
  familyAccountDesc: 'Connect elder bedside tablet with child companion phone',
  elderSyncCode: 'Elder Device Sync Code',
  childPhoneLabel: 'Child / Caregiver Mobile Number',
  caregiverNameLabel: 'Caregiver Name & Relation (e.g. Son, Daughter)',
  pairAccountBtn: 'Link Caregiver Phone',
  pairedSuccess: 'Family Account Linked Successfully',
  shareWhatsappReport: 'Share Daily Report via WhatsApp',
  cloudSyncNow: 'Sync Data to Cloud',
};

const as: Translations = {
  appName: 'স্মৃতি সাথী',
  appTagline: 'আপোনাৰ ভাষাত স্মৃতি যত্ন — অনলাইন বা অফলাইন',
  home: 'ঘৰ',
  games: 'খেল',
  reminders: 'সোঁৱৰণী',
  settings: 'ছেটিংছ',
  caregiver: 'যত্নকাৰী',
  myBrain: 'মোৰ মগজু',

  hi: 'নমস্কাৰ',
  welcomeBack: 'পুনৰ স্বাগতম',
  points: 'পইণ্ট',
  streak: 'ক্ৰম',
  dailyActiveStreak: 'দৈনিক সক্ৰিয় ক্ৰম',
  cognitiveIndex: 'জ্ঞানভিত্তিক সূচক (CPI)',
  voiceGuide: 'মাতৃভাষাৰ কণ্ঠ সহায়ক',
  switchProfile: 'প্ৰফাইল সলনি কৰক',

  firstWorkout: 'আপোনাৰ প্ৰথম অভ্যাস',
  todaysRoutine: 'আজিৰ মগজুৰ ৰুটিন',
  workoutCount: (current, total) => `অনুশীলন ${current} / ${total}`,
  start: 'আৰম্ভ কৰক',
  continueWorkout: 'আগবঢ়াওক',
  workoutDesc: 'প্ৰতিটো খেলেই আপোনাৰ চিন্তা-শক্তিৰ ভিন্ন অংশক সক্ৰিয় কৰে। আহক খেলো।',
  todaysExercises: 'আজিৰ অনুশীলনসমূহ',
  speedMatchTitle: 'দ্ৰুত স্মৃতি মিলন',
  speedMatchSubtitle: 'কাৰ্য্যকৰী স্মৃতি (WORKING MEMORY)',
  masterpieceTitle: 'দৈনন্দিন অভ্যাস (ক্ৰম সজ্জা)',
  masterpieceSubtitle: 'সময় আৰু স্থান (TEMPORAL ORIENTATION)',
  mathWorkoutSubtitle: 'প্ৰক্ৰিয়াকৰণ গতি (PROCESSING SPEED)',
  languageWorkoutSubtitle: 'মনোযোগ আৰু একাগ্ৰতা (ATTENTION & FOCUS)',
  ebbFlowTitle: 'স্মৃতি আৰু সুৰ (অতীত সোঁৱৰণ)',
  ebbFlowSubtitle: 'মনৰ স্থিতি • ঐতিহ্য',
  trainOfThoughtTitle: 'মনোযোগ আৰু ঔষধ সোঁৱৰণী',
  trainOfThoughtSubtitle: 'মনোযোগ • দিনপঞ্জী',
  moreWorkouts: 'অধিক মগজুৰ অনুশীলন',
  allIncludedOffline: 'সকলো উপলব্ধ • অফলাইন',
  mathEstimation: 'গণনা আৰু হিচাপ',
  mathDesc: 'দৈনন্দিন বজাৰ, মুদ্ৰা আৰু সংখ্যা গণনাৰ সহজ অভ্যাস।',
  languageBhashini: 'মাতৃভাষাৰ যত্ন (ভাষিনী AI)',
  languageDesc: 'অসমীয়া ফকৰা-যোজনা, শব্দ ভঁৰাল আৰু পুৰণি লোককথা।',
  favorites: 'প্ৰিয় খেলসমূহ',
  favoritesDesc: 'আপুনি খেলিবলৈ ভাল পোৱা স্মৃতিবৰ্ধক খেলসমূহ উপভোগ কৰক।',
  strengthen: 'সহজ আৰু উৎসাহজনক যত্ন',
  strengthenDesc: 'ভুলহীন আৰু চাপমুক্ত পদ্ধতিৰে আত্মবিশ্বাস বৃদ্ধি কৰক।',
  quickRoutine: 'দ্ৰুত ৫ মিনিটৰ ৰুটিন',
  quickDesc: 'কম সময়ৰ বাবে প্ৰস্তুত কৰা শান্ত মগজুৰ অনুশীলন।',
  playNow: 'খেলক →',
  clinicalEvidenceTitle: 'চিকিৎসাজনিত আৰু বৈজ্ঞানিক যত্ন',
  clinicalEvidenceDesc: 'আন্তঃৰাষ্ট্ৰীয় CST পদ্ধতি আৰু উত্তৰ-পূৰ্বাঞ্চলৰ ভাষিক প্ৰয়োজনীয়তালৈ চাই প্ৰস্তুত কৰা সৰল স্মৃতি যত্ন।',

  memoryMatch: 'স্মৃতি মিলন',
  memoryMatchDesc: 'একে ধৰণৰ কাৰ্ড বিচাৰক',
  dailyRoutine: 'দৈনিক ৰুটিন',
  dailyRoutineDesc: 'আপোনাৰ দৈনন্দিন কাৰ্যকলাপ ক্ৰমত ৰাখক',
  startGame: 'খেল আৰম্ভ কৰক',
  level: 'স্তৰ',
  score: 'স্ক\'ৰ',
  greatJob: 'বৰ ভাল!',
  wellDone: 'ভাল কৰিছে!',
  keepGoing: 'আগবাঢ়ক, আপুনি ভাল কৰি আছে!',
  tryAgain: 'প্ৰায় হৈছে! আৰু এবাৰ চেষ্টা কৰক',
  gameComplete: 'খেল সম্পূৰ্ণ!',
  playAgain: 'পুনৰ খেলক',
  backToHome: 'ঘৰলৈ উভতি যাওক',
  findThePairs: 'একে ধৰণৰ যোৰ বিচাৰক',
  pairsFound: 'যোৰ পোৱা',
  attempts: 'চেষ্টা',
  orderYourDay: 'আপোনাৰ দিনটো সজাওক',
  putInOrder: 'এই কাৰ্যকলাপবোৰ সঠিক ক্ৰমত ৰাখক',
  correctOrder: 'সেয়া সঠিক ক্ৰম!',
  wakeUp: 'সাৰ পোৱা',
  brushTeeth: 'দাঁত মাজা',
  breakfast: 'ৰাতিপুৱাৰ আহাৰ',
  takeMedicine: 'ঔষধ খোৱা',
  morningWalk: 'ৰাতিপুৱাৰ খোজ',
  lunch: 'দুপৰীয়াৰ আহাৰ',
  rest: 'জিৰণি',
  eveningTea: 'আবেলিৰ চাহ',
  dinner: 'ৰাতিৰ আহাৰ',
  sleep: 'শুৱা',

  medicine: 'ঔষধ',
  water: 'পানী',
  activity: 'কাৰ্যকলাপ',
  appointment: 'সাক্ষাৎকাৰ',
  timeForMedicine: 'ঔষধ খোৱাৰ সময় হৈছে',
  timeForWater: 'পানী খোৱাৰ সময় হৈছে',
  timeForActivity: 'মগজুৰ খেলৰ সময়!',
  reminderAcknowledged: 'হৈ গ\'ল!',
  addReminder: 'সোঁৱৰণী যোগ কৰক',
  noReminders: 'কোনো সোঁৱৰণী নাই',
  dismiss: 'বাতিল কৰক',

  caregiverDashboard: 'যত্নকাৰীৰ ডেছব\'ৰ্ড',
  engagementSummary: 'সংযোগৰ সাৰাংশ',
  gamesPlayed: 'খেলা খেল',
  totalTime: 'মুঠ সময়',
  accuracy: 'শুদ্ধতা',
  reminderAdherence: 'সোঁৱৰণী পালন',
  performanceTrend: 'প্ৰদৰ্শনৰ ধাৰা',
  noDataYet: 'এতিয়ালৈকে কোনো তথ্য নাই। খেল আৰম্ভ কৰক!',
  lastDays: 'শেষ ৭ দিন',
  alerts: 'সতৰ্কতা',
  noAlerts: 'কোনো সতৰ্কতা নাই — সকলো ঠিকে আছে!',

  elderProfile: 'জ্যেষ্ঠ ব্যক্তিৰ প্ৰফাইল',
  allProfiles: 'পঞ্জীকৃত জ্যেষ্ঠসকল',
  activeProfile: 'বৰ্তমানৰ জ্যেষ্ঠ',
  addProfile: 'নতুন প্ৰফাইল যোগ কৰক',
  createNewProfile: 'নতুন সদস্য অন্তৰ্ভুক্ত কৰক',
  elderNameLabel: 'জ্যেষ্ঠ ব্যক্তিৰ নাম (যেনে আইতা / দেউতা)',
  ageLabel: 'বয়স',
  nativeLanguageLabel: 'মাতৃভাষা',
  saveProfile: 'সংৰক্ষণ কৰক',
  cancel: 'বাতিল কৰক',
  edit: 'সম্পাদনা',
  delete: 'মচি পেলাওক',
  registeredCare: 'দৈনিক ডিমেনচিয়া যত্নৰ অধীনত পঞ্জীকৃত',

  language: 'ভাষা',
  textSize: 'আখৰৰ আকাৰ',
  normal: 'সাধাৰণ',
  large: 'ডাঙৰ',
  standardText: 'সাধাৰণ',
  largeText: '🔍 ডাঙৰ আখৰ (জ্যেষ্ঠসকলৰ বাবে)',
  regionalLanguage: 'আঞ্চলিক ভাষা (ভাষিনী AI)',
  regionalLanguageDesc: 'আপোনাৰ নিজৰ মাতৃভাষাত স্পষ্ট কণ্ঠ আৰু সহায় নিৰ্দেশনা:',
  accessibility: 'সহজ ব্যৱহাৰ (এক্সেচিবিলিটি)',
  textScaling: 'আখৰৰ আকাৰ সলনি',
  dpdpCompliance: 'ডিজিটেল ব্যক্তিগত তথ্য সুৰক্ষা (DPDP 2023)',
  dpdpDesc: 'সকলো তথ্য কেৱল এই টেবলেটতে সংৰক্ষিত। পৰিয়ালৰ তত্ত্বাৱধায়কে যিকোনো সময়তে অনুমতি সলনি কৰিব পাৰে।',
  consent: 'তথ্যৰ সন্মতি',
  consentGranted: 'আপুনি কাৰ্যকলাপৰ তথ্য সংৰক্ষণৰ সন্মতি দিছে',
  revokeConsent: 'সন্মতি প্ৰত্যাহাৰ কৰক',
  grantConsent: 'সন্মতি দিয়ক',
  consentActive: '✓ সন্মতি সক্ৰিয় (সুৰক্ষিত)',
  consentRevoked: '✕ সন্মতি স্থগিত',
  revoke: 'প্ৰত্যাহাৰ',
  grant: 'অনুমোদন',

  appUpdates: 'এপ্লিকেচন আপডেট',
  checkForUpdates: 'নতুন সংস্কৰণ পৰীক্ষা কৰক',
  checkingUpdates: 'পৰীক্ষা কৰি থকা হৈছে...',
  upToDate: '✓ স্মৃতি সাথী সম্পূৰ্ণ আপ-টু-ডেট',
  updateAvailableBanner: '🚀 নতুন সংস্কৰণ উপলব্ধ!',
  downloadUpdate: 'ডাউনলোড আৰু আপডেট APK',
  version: 'সংস্কৰণ',

  domainMemory: 'স্মৃতি শক্তি',
  domainMemoryDesc: 'কাৰ্ড মিলন আৰু দৃশ্যপট সোঁৱৰণ',
  domainRoutine: 'দৈনিক ক্ৰম',
  domainRoutineDesc: 'দিনটোৰ সময় আৰু কামৰ ক্ৰম',
  domainAttention: 'মনোযোগ আৰু একাগ্ৰতা',
  domainAttentionDesc: 'স্থিৰ মনোযোগ আৰু লক্ষ্য',
  domainSpeed: 'দ্ৰুততা আৰু প্ৰতিক্ৰিয়া',
  domainSpeedDesc: 'মৃদু আৰু শান্ত প্ৰতিক্ৰিয়াৰ সময়',
  domainCalculation: 'গণনা আৰু হিচাপ',
  domainCalculationDesc: 'দৈনন্দিন বজাৰ আৰু মুদ্ৰাৰ হিচাপ',
  domainLanguage: 'মাতৃভাষা আৰু শব্দ ভঁৰাল',
  domainLanguageDesc: 'অসমীয়া ফকৰা-যোজনা আৰু সংস্কৃতি',
  notTestedYet: 'এতিয়ালৈকে পৰীক্ষা হোৱা নাই',
  playToTestDomain: 'এই অংশ জুখিবলৈ খেল আৰম্ভ কৰক',
  dailyGoalProgress: (current, total) => `আজিৰ লক্ষ্য: ${current} / ${total} অনুশীলন`,
  resetAllData: 'সকলো তথ্য ০ লৈ ৰিছেট কৰক',
  resetAllDataDesc: 'পুৰণি পৰীক্ষামূলক তথ্য মচি নতুনকৈ ০ পৰা আৰম্ভ কৰক।',
  resetDataConfirm: 'আপুনি নিশ্চিতনে? সকলো পুৰণি তথ্য মচি পেলোৱা হ\'ব।',
  resetDataSuccess: '✓ সকলো তথ্য সফলতাৰে ০ লৈ ৰিছেট কৰা হ\'ল!',

  lpiIndexTab: 'SPI সূচক',
  progressTab: 'প্ৰগতি',
  caregiverTab: 'আশা / যত্নকাৰী',
  familySyncTab: 'পৰিয়ালৰ সংযোগ 📲',
  privacyTab: 'তথ্য সুৰক্ষা',
  overallSpiScore: 'সামগ্ৰিক SPI সূচক',
  spiScoreDesc: 'স্মৃতি, দৈনিক ক্ৰম আৰু ভাষাৰ অনুশীলনৰ ওপৰত ভিত্তি কৰি গণিত।',
  ashaObservationsTitle: 'আশা স্বাস্থ্যকৰ্মীৰ পৰ্যবেক্ষণ',
  ashaObs1: 'নিয়মীয়াতা: দৈনিক CST মগজুৰ অনুশীলন সঠিকভাৱে কৰা হৈছে।',
  ashaObs2: 'সহজ অগ্ৰগতি: স্তৰ ব্যৱস্থাই আত্মবিশ্বাস বৰ্তাই ৰাখিছে।',
  ashaObs3: 'পৰিয়ালৰ টোকা: দৈনন্দিন কামৰ ক্ৰম স্বাভাৱিক।',
  historicalAccuracyTrend: 'পূৰ্বৰ শুদ্ধতাৰ ধাৰা',
  last10Sessions: 'শেষ ১০টা অনুশীলন',
  noPlayDataYet: 'এতিয়ালৈকে কোনো তথ্য নাই। আপোনাৰ প্ৰথম অনুশীলন আৰম্ভ কৰক!',
  cognitiveStabilityCurve: 'মানসিক স্থিৰতাৰ ৰেখা',
  stable: 'সুস্থিৰ',
  stabilityDesc: 'নিয়মীয়া অনুশীলনে স্মৃতি শক্তি স্বাভাৱিক আৰু সুস্থিৰ কৰি ৰাখিছে।',

  evidenceBasedWorkouts: 'জ্যেষ্ঠসকলৰ বাবে প্ৰস্তুত কৰা শান্ত আৰু বৈজ্ঞানিক স্মৃতি যত্ন',
  dailyRecommendation: 'দৈনিক পৰামৰ্শ',
  coreCognitiveDomains: 'প্ৰধান মানসিক দিশসমূহ',
  northEastHeritage: 'উত্তৰ-পূৰ্বাঞ্চলৰ ঐতিহ্য আৰু সোঁৱৰণী',
  northEastHeritageDesc: 'অসম, বড়োলেণ্ড আৰু মণিপুৰৰ লোক-সংস্কৃতি আৰু পুৰণি স্মৃতি',

  updateModalTitle: '🚀 নতুন সংস্কৰণ উপলব্ধ!',
  updateModalDesc: 'স্মৃতি সাথীৰ নতুন সংস্কৰণ সাজু হৈছে — উন্নত ভাষা সমৰ্থন আৰু সহজ ব্যৱহাৰৰ সৈতে।',
  installUpdateNow: 'এতিয়াই আপডেট ইনষ্টল কৰক',
  updateDismiss: 'পিছত',
  updateCheckPrompt: 'নতুন আপডেট পৰীক্ষা কৰি থকা হৈছে...',
  noUpdateFound: 'আপুনি স্মৃতি সাথীৰ সৰ্বশেষ সংস্কৰণ ব্যৱহাৰ কৰি আছে!',

  // Family Account & Pairing
  familyLink: 'পৰিয়াল সংযোগ',
  familyAccountTitle: 'পৰিয়াল একাউন্ট আৰু সংযোগ',
  familyAccountDesc: 'আইতা/দেউতাৰ টেবলেট সন্তানৰ মোবাইলৰ সৈতে সংযোগ কৰক',
  elderSyncCode: 'জ্যেষ্ঠ সদস্যৰ সংযোগ ক’ড',
  childPhoneLabel: 'সন্তান / যত্নকাৰীৰ মোবাইল নম্বৰ',
  caregiverNameLabel: 'যত্নকাৰীৰ নাম আৰু সম্পৰ্ক (যেনে: ল’ৰা, ছোৱালী)',
  pairAccountBtn: 'যত্নকাৰীৰ ফোন সংযোগ কৰক',
  pairedSuccess: 'পৰিয়াল একাউন্ট সফলতাৰে সংযোগ কৰা হ’ল',
  shareWhatsappReport: 'হোৱাটছএপত দৈনিক স্বাস্থ্য ৰিপৰ্ট পঠিয়াওক',
  cloudSyncNow: 'ক্লাউডলৈ তথ্য সংমিশ্ৰণ কৰক',
};

// Bodo translations (Devanagari script)
const brx: Translations = {
  appName: 'स्मृति साथी',
  appTagline: 'नोंथाइनि रावओ सायाव — अनलाइन एबा अफलाइन',
  home: 'नोगोरजों',
  games: 'गेलेनाय',
  reminders: 'मोनहोनाय',
  settings: 'गोरोबथा',
  caregiver: 'सायखांनायगिरि',
  myBrain: 'आंनि गोसो',

  hi: 'खुम्चुम',
  welcomeBack: 'फैगौ मोनसे ओंखारलाय',
  points: 'मार्क',
  streak: 'सारि',
  dailyActiveStreak: 'सानफ्रोमबोनि सारि',
  cognitiveIndex: 'गोसोनि सूचक (CPI)',
  voiceGuide: 'राव सहाय',
  switchProfile: 'प्रफाइल सोलाय',

  firstWorkout: 'नोंथाइनि गिबि गेलेनाय',
  todaysRoutine: 'दिनैनि गोसोनि हाबाफारि',
  workoutCount: (current, total) => `गेलेनाय ${current} / ${total}`,
  start: 'जागाय',
  continueWorkout: 'सालायलांबाय था',
  workoutDesc: 'मोनफ्रोमबो गेलेनाया नोंथाइनि साननाय शक्तिखौ बांहोयो। फै गेलेनो।',
  todaysExercises: 'दिनैनि गेलेनायफोर',
  speedMatchTitle: 'गोख्रै मोनथाइ',
  speedMatchSubtitle: 'मोनथाइ सांग्रांथि (WORKING MEMORY)',
  masterpieceTitle: 'सानफ्रोमबोनि खामानि',
  masterpieceSubtitle: 'सान आरो जायगा (TEMPORAL ORIENTATION)',
  mathWorkoutSubtitle: 'गोख्रै सांग्रांथि (PROCESSING SPEED)',
  languageWorkoutSubtitle: 'गोसो होनाय (ATTENTION & FOCUS)',
  ebbFlowTitle: 'गोसोखांफानाय आरो खन्थाइ',
  ebbFlowSubtitle: 'गोसोनि गोहो • दोहोरोम',
  trainOfThoughtTitle: 'गोसो होनाय आरो मुलि',
  trainOfThoughtSubtitle: 'गोसो होनाय • सानफ्रोमबोनि खामानि',
  moreWorkouts: 'गुबुन गेलेनायफोर',
  allIncludedOffline: 'गासैबो दं • अफलाइन',
  mathEstimation: 'सानखान्थि आरो हिसाब',
  mathDesc: 'सानफ्रोमबोनि हाथायाव बाहायनाय रां-रुफा आरो हिसाब।',
  languageBhashini: 'नोंथाइनि राव (भाषिनी AI)',
  languageDesc: 'बर\' राव, बाथ्रा आरो सल\'फोर।',
  favorites: 'मोजां मोननाय गेलेनाय',
  favoritesDesc: 'नोंनि मोजां मोननाय गोसोनि गेलेनायखौ गेले।',
  strengthen: 'रेबगें गेलेनाय',
  strengthenDesc: 'गोरोन्थिया गैयि आरो गोरलै गेलेनाय।',
  quickRoutine: 'गोख्रै ५ मिनिटनि हाबा',
  quickDesc: 'कम समायनि गोसोनि हाबाफारि।',
  playNow: 'गेलेनो →',
  clinicalEvidenceTitle: 'गोसोनि गोहो बांहोनाय',
  clinicalEvidenceDesc: 'दैदेनजानाय CST पद्धति आरो बर\' रावजों बाहायजानाय।',

  memoryMatch: 'मोनथाइ गेलेनाय',
  memoryMatchDesc: 'मावरि कार्ड नायना',
  dailyRoutine: 'सान्नायजों खामानि',
  dailyRoutineDesc: 'दिनैनि खामानिखौ सारि मोननो',
  startGame: 'गेलेनाय जागा',
  level: 'सथर',
  score: 'मार्क',
  greatJob: 'बर मोजां!',
  wellDone: 'मोजां मोनसे!',
  keepGoing: 'आगान थां, नों बर मोजां मावदों!',
  tryAgain: 'गोबां सिम जाबाय! आरो रोखा मावनो',
  gameComplete: 'गेलेनाय जोबनाय!',
  playAgain: 'आरो गेलेनो',
  backToHome: 'नोगोरजोंआव थांनो',
  findThePairs: 'मावरि कार्ड नायना',
  pairsFound: 'मावरि मोन',
  attempts: 'रोखा',
  orderYourDay: 'नोंनि सान सारि दोन',
  putInOrder: 'बे खामानिखौ गोरोब सारिआव दोन',
  correctOrder: 'बेयो गोरोब सारि!',
  wakeUp: 'गोसो खालाम',
  brushTeeth: 'हा साफाय',
  breakfast: 'सुबुं जानाय',
  takeMedicine: 'दाबाइ जानाय',
  morningWalk: 'सुबुंनि हाबाय',
  lunch: 'सानजानाय',
  rest: 'जोंनाय',
  eveningTea: 'बेलासिनि साहा',
  dinner: 'मोनाबिलि जानाय',
  sleep: 'गोसो खोनाय',

  medicine: 'दाबाइ',
  water: 'दै',
  activity: 'खामानि',
  appointment: 'मोनसे लानाय',
  timeForMedicine: 'दाबाइ जानायनि समाय जादों',
  timeForWater: 'दै दुंनायनि समाय जादों',
  timeForActivity: 'गेलेनायनि समाय!',
  reminderAcknowledged: 'जादों!',
  addReminder: 'मोनहोनाय दाजाब',
  noReminders: 'मोनहोनाय गैयि',
  dismiss: 'दानगार',

  caregiverDashboard: 'सायखांनायगिरिनि डेसबर्ड',
  engagementSummary: 'लोगोसे दाबनायनि सारांश',
  gamesPlayed: 'गेलेनाय',
  totalTime: 'जेराव समाय',
  accuracy: 'गोरोब',
  reminderAdherence: 'मोनहोनाय मानि',
  performanceTrend: 'खामानिनि गति',
  noDataYet: 'एसे तक data गैयि। गेलेनाय जागाय!',
  lastDays: 'जोबथा ७ सान',
  alerts: 'सावगारि',
  noAlerts: 'सावगारि गैयि — गासैबो मोजां!',

  elderProfile: 'गोजौ सुबुंनि प्रफाइल',
  allProfiles: 'गासै प्रफाइल',
  activeProfile: 'चालु सुबुं',
  addProfile: 'गोदान प्रफाइल दाजाब',
  createNewProfile: 'गोदान सुबुं थिसन',
  elderNameLabel: 'सुबुंनि मुं (जेरै आइ / आफा)',
  ageLabel: 'बैसो',
  nativeLanguageLabel: 'गाहाय राव',
  saveProfile: 'दोनथुम',
  cancel: 'दानगार',
  edit: 'सोलाय',
  delete: 'मसि',
  registeredCare: 'दिनैनि गोसोनि हेफाजाबाव मुं थिसनबाय',

  language: 'राव',
  textSize: 'हांखोनि महर',
  normal: 'गुबुन',
  large: 'गेदेर',
  standardText: 'गुबुन',
  largeText: '🔍 गेदेर हांखो',
  regionalLanguage: 'नोंथाइनि राव (भाषिनी AI)',
  regionalLanguageDesc: 'नोंथाइनि गाहाय रावजों रोखा खोन्थाय आरो सहाय:',
  accessibility: 'गोरलै बाहायनाय',
  textScaling: 'हांखोनि महर',
  dpdpCompliance: 'डाटा सुबुरुं (DPDP 2023)',
  dpdpDesc: 'गासै डाटा बे टेबलेटावनो दोनथुमनाय जायो।',
  consent: 'डाटा अनुमति',
  consentGranted: 'नों data सेव खालामनायनि अनुमति होदों',
  revokeConsent: 'अनुमति फिन लानाय',
  grantConsent: 'अनुमति होनाय',
  consentActive: '✓ अनुमति जाबाय',
  consentRevoked: '✕ अनुमति फिन लाबाय',
  revoke: 'फिन लानाय',
  grant: 'होनाय',

  appUpdates: 'एप आपदेत',
  checkForUpdates: 'गोदान आपदेत नाय',
  checkingUpdates: 'नायबाय थानाय...',
  upToDate: '✓ गासैबो गोदान',
  updateAvailableBanner: '🚀 गोदान आपदेत मोनबाय!',
  downloadUpdate: 'दाउनलद खालाम APK',
  version: 'महर',

  domainMemory: 'मोनथाइ गोहो',
  domainMemoryDesc: 'कार्ड नायनाय आरो गोसोखां',
  domainRoutine: 'सानफ्रोमनि खामानि',
  domainRoutineDesc: 'साननि सारि आरो समाय',
  domainAttention: 'गोसो होनाय',
  domainAttentionDesc: 'थाद\'नाय गोसो होनाय',
  domainSpeed: 'गोख्रैथि',
  domainSpeedDesc: 'लिरनाय आरो फिननाय',
  domainCalculation: 'साननाय आरो हिसाब',
  domainCalculationDesc: 'हाट बाजारनि साननाय',
  domainLanguage: 'राव आरो सोदोब',
  domainLanguageDesc: 'बर\' बाथ्रा आरो हारिमु',
  notTestedYet: 'आनजाद जायाखै',
  playToTestDomain: 'बेखौ नायनो गेलेनो जागाय',
  dailyGoalProgress: (current, total) => `दिनैनि थांखि: ${current} / ${total} गेलेनाय`,
  resetAllData: 'गासै डाटा ० खालाम',
  resetAllDataDesc: 'गोजाम स्कोर मसिनानै गोदानै ० आव जागाय।',
  resetDataConfirm: 'नों रोखा नामा? गासै डाटा मसिगोन।',
  resetDataSuccess: '✓ गासै डाटा ० जाबाय!',

  lpiIndexTab: 'SPI इन्देक्स',
  progressTab: 'दावगानाय',
  caregiverTab: 'आशा / सायखांनायगिरि',
  familySyncTab: 'नखर खौरां 📲',
  privacyTab: 'डाटा रैखाथि',
  overallSpiScore: 'गासैबो SPI मार्क',
  spiScoreDesc: 'मोनथाइ आरो सानफ्रोमनि खामानिनि सायाव।',
  ashaObservationsTitle: 'आशा मावगिरिनि नोजोर',
  ashaObs1: 'नेम: सानफ्रोमबो गेलेनाया मोजां जादों।',
  ashaObs2: 'साधना: मोजां महरै दावगाबाय थादों।',
  ashaObs3: 'नखर: गासैबो नेमाव दं।',
  historicalAccuracyTrend: 'सिगांनि मोजां महर',
  last10Sessions: 'जोबथा १० गेलेनाय',
  noPlayDataYet: 'डाटा गैथ\'आ। गेलेनो जागाय!',
  cognitiveStabilityCurve: 'गोसोनि थि महर',
  stable: 'मोजां',
  stabilityDesc: 'गोसोनि गोहो मोजां दं।',

  evidenceBasedWorkouts: 'बायोवृद्ध सुबुंफोरनि थाखाय गोजोन गेलेनाय',
  dailyRecommendation: 'दिनैनि गोनांथार',
  coreCognitiveDomains: 'गाहाय गोसोनि खोलोब',
  northEastHeritage: 'सानजा-सा हारिमु आरो गोसोखां',
  northEastHeritageDesc: 'आसाम, बड\'लेन्द आरो मनिपुरनि हारिमु',

  updateModalTitle: '🚀 गोदान आपदेत मोनबाय!',
  updateModalDesc: 'स्मृति साथीनि गोदान महर फैबाय — साबसिन राव आरो गेलेनायजों।',
  installUpdateNow: 'दासान्दि आपदेत खालाम',
  updateDismiss: 'उनाव',
  updateCheckPrompt: 'गोदान आपदेत नायबाय थानाय...',
  noUpdateFound: 'नोंथाङा जोबथा महर बाहायगासिनो दं!',

  // Family Account & Pairing
  familyLink: 'नोगोर लोगो',
  familyAccountTitle: 'नोगोर एकान्ट आरो लोगो खालामनाय',
  familyAccountDesc: 'गोजौ मानसि टैबलेटखौ फिसाफोरनि मबाइलजों लोगो खालाम',
  elderSyncCode: 'गोजौ मानसि डिभाइस कोड',
  childPhoneLabel: 'फिसा / सामलायग्रा मबाइल नम्बर',
  caregiverNameLabel: 'सामलायग्रानि मुं आरो सम्बन्ध',
  pairAccountBtn: 'सामलायग्रा फोन लोगो खालाम',
  pairedSuccess: 'नोगोर एकान्ट मोजाङै लोगो जाबाय',
  shareWhatsappReport: 'व्हाट्सएपआव साननि रिपर्ट हर',
  cloudSyncNow: 'क्लाउड सिंक खालाम',
};

// Manipuri translations (Bengali script)
const mni: Translations = {
  appName: 'স্মৃতি সাথী',
  appTagline: 'নহাক্কী লোনদা নিংশিং পাম্বৈ — ওনলাইন নত্রগা ওফলাইন',
  home: 'য়ুম',
  games: 'সানাথোই',
  reminders: 'নিংশিংহন্বা',
  settings: 'সেটিংস',
  caregiver: 'য়েংসিনবা',
  myBrain: 'ঐগী ৱাখল',

  hi: 'খুরুমজরি',
  welcomeBack: 'অমুক ওকচরি',
  points: 'পয়েন্ট',
  streak: 'লেপহন্বা',
  dailyActiveStreak: 'নুমিৎ খুদিংগী লেপহন্বা',
  cognitiveIndex: 'ৱাখলগী শক্তিমাল (CPI)',
  voiceGuide: 'লোনগী খোন্থোক সহায়',
  switchProfile: 'প্রফাইল হোংদোকপা',

  firstWorkout: 'নহাক্কী অহানবা শানাথোই',
  todaysRoutine: 'ঙসিগী নিংশিং থৌরম',
  workoutCount: (current, total) => `শানাথোই ${current} / ${total}`,
  start: 'হৌদোকউ',
  continueWorkout: 'মখা চত্থউ',
  workoutDesc: 'শানাথোই খুদিংমক্না ৱাখলবু হেন্না থৌনা হাপ্পা ঙমহল্লি। শানসি।',
  todaysExercises: 'ঙসিগী শানাথোইশিং',
  speedMatchTitle: 'য়াম্না থুনা নিংশিংবা',
  speedMatchSubtitle: 'নিংশিংবা মশক (WORKING MEMORY)',
  masterpieceTitle: 'নুমিৎ খুদিংগী থবক',
  masterpieceSubtitle: 'মতমগী ৱাখল্লোন (TEMPORAL ORIENTATION)',
  mathWorkoutSubtitle: 'খোংজেলগী মশক (PROCESSING SPEED)',
  languageWorkoutSubtitle: 'পুংলুকচিংবা (ATTENTION & FOCUS)',
  ebbFlowTitle: 'পুন্সিগী নীংশিংবা শৈশক',
  ebbFlowSubtitle: 'ৱাখল শিংথা • লিখন',
  trainOfThoughtTitle: 'লুচিংবা অমসুং হিদাক নীংশিংবা',
  trainOfThoughtSubtitle: 'লুচিংবা • থবক ক্ৰম',
  moreWorkouts: 'অতোপ্পা শানাথোইশিং',
  allIncludedOffline: 'পুম্নমক য়াওরে • ওফলাইন',
  mathEstimation: 'শেন্থোক শেনবুং নিংশিংবা',
  mathDesc: 'নুমিৎ খুদিংগী কৈথেল অমসুং শেন্থোকপগী মশক খংদোকপা।',
  languageBhashini: 'মৈতৈলোন (ভাষিনী AI)',
  languageDesc: 'মৈতৈ পাউৰৌ, ৱাহৈ অমসুং পুৱারিগী ৱারীশিং।',
  favorites: 'পাম্নবা শানাথোই',
  favoritesDesc: 'নহাক্না শানবা পাম্বা নিংশিং শানাথোইশিং শানবিয়ু।',
  strengthen: 'নুংঙাইবা শানাথোই',
  strengthenDesc: 'অশোক অপন য়াওদনা থৌনা হাপ্পা শানাথোই।',
  quickRoutine: 'মিনিট ৫ গী শানাথোই',
  quickDesc: 'মতম তেন্না ৱাখল শান্তনা শান্নবা।',
  playNow: 'শানসি →',
  clinicalEvidenceTitle: 'ৱাখলগী চেকশিন থৌরাং',
  clinicalEvidenceDesc: 'মালেমগী CST পদ্ধতি অমসুং মৈতৈলোনগী লাইথোকহল্লবা পাম্বৈ।',

  memoryMatch: 'নিংশিং শানাথোই',
  memoryMatchDesc: 'মান্নবা কার্দশিং ফংবিয়ু',
  dailyRoutine: 'নুমিৎ খুদিংগী থবক',
  dailyRoutineDesc: 'নহাক্কী নুমিৎ খুদিংগী তৌরবশিং চুন্না থম্মু',
  startGame: 'হৌদোক্কনি',
  level: 'লেবেল',
  score: 'মার্ক',
  greatJob: 'য়াম্না ফবি!',
  wellDone: 'ফজনা তৌবি!',
  keepGoing: 'চৎথরি, নহাক ফজনা তৌরি!',
  tryAgain: 'চাওলে হৌরকলে! অমুক হোৎননসি',
  gameComplete: 'সানাথোই লোয়রে!',
  playAgain: 'অমুক শানসি',
  backToHome: 'য়ুমদা হন্সিল্লু',
  findThePairs: 'মান্নবা কার্দশিং ফংবিয়ু',
  pairsFound: 'ফংলবা',
  attempts: 'হোৎনরবা',
  orderYourDay: 'নহাক্কী নুমিৎ থম্মু',
  putInOrder: 'মসি তৌরবশিং চুন্না থম্মু',
  correctOrder: 'মসি অচুম্বা চুন্নি!',
  wakeUp: 'ফোংদোকপা',
  brushTeeth: 'য়া পোৎথোকপা',
  breakfast: 'অহিংনুংগী চাক',
  takeMedicine: 'লায়েং চাবা',
  morningWalk: 'অহিংনুংদা চৎপা',
  lunch: 'অনিংনুংগী চাক',
  rest: 'শংবা',
  eveningTea: 'নুংথিলনুংগী চা',
  dinner: 'অনুংবানুংগী চাক',
  sleep: 'তুম্বা',

  medicine: 'লায়েং',
  water: 'ঈশিং',
  activity: 'তৌগৎপা',
  appointment: 'ময়াম পাংথোক্কদবা',
  timeForMedicine: 'লায়েং চাবা মতম ওইরে',
  timeForWater: 'ঈশিং থক্কদবা মতম ওইরে',
  timeForActivity: 'সানাথোই শান্নবা মতম!',
  reminderAcknowledged: 'ওইরে!',
  addReminder: 'নিংশিংহন্বা থাপু',
  noReminders: 'নিংশিংহন্বা অমত্তা লৈতে',
  dismiss: 'লেপপা',

  caregiverDashboard: 'য়েংসিনবগী ডেসবোর্ড',
  engagementSummary: 'শরুক য়াবগী মশক',
  gamesPlayed: 'শান্নরবা সানাথোই',
  totalTime: 'পুম্নমক মতম',
  accuracy: 'অচুম্বা',
  reminderAdherence: 'নিংশিংহন্বা ইন্নরবা',
  performanceTrend: 'তৌবিবগী মখল',
  noDataYet: 'হৌজিক ফংনদ্রে। শানাথোই শানসি!',
  lastDays: 'মঙাতানিরবা নুমিৎ ৭',
  alerts: 'চেকশিন্নবা',
  noAlerts: 'চেকশিন্নবা লৈতে — পুম্নমক ফজরি!',

  elderProfile: 'অহন মীওইগী প্রফাইল',
  allProfiles: 'পঞ্জীকৃত মীওইশিং',
  activeProfile: 'হৌজিক্কী মীওই',
  addProfile: 'অনৌবা প্রফাইল হাপ্পা',
  createNewProfile: 'অনৌবা মীওই পঞ্জীকৃত তৌবা',
  elderNameLabel: 'মীওইগী মমিং (ইবুংখো / ইবেম্মা)',
  ageLabel: 'চহি',
  nativeLanguageLabel: 'অহানবা লোল',
  saveProfile: 'থম্বীয়ু',
  cancel: 'লেপপা',
  edit: 'শেমদোকপা',
  delete: 'মুত্থৎপা',
  registeredCare: 'নুমিৎ খুদিংগী নিংশিং যত্নদা য়াওরে',

  language: 'লোল',
  textSize: 'ইয়েক চাওনা',
  normal: 'গুনবাল',
  large: 'অচৌবা',
  standardText: 'গুনবাল',
  largeText: '🔍 অচৌবা ইয়েক',
  regionalLanguage: 'মৈতৈলোন (ভাষিনী AI)',
  regionalLanguageDesc: 'নহাক্কী লোনদা অশেংবা ৱাহৈ অমসুং নিংশিংবা:',
  accessibility: 'লাইথোকহল্লবা',
  textScaling: 'ইয়েক চাওনা শেম্বা',
  dpdpCompliance: 'ডেটা ঙাকশেন (DPDP 2023)',
  dpdpDesc: 'ডেটা পুম্নমক টেব্লেত অসিদা থম্মি। য়েংসিনবনা মতম খুদিংদা লৌথোকপা য়াই।',
  consent: 'ডেটা অনুমতি',
  consentGranted: 'নহাক্না তৌরবশিংগী ডেটা থম্নবা অয়াবা পীরে',
  revokeConsent: 'অনুমতি লৌথোকপা',
  grantConsent: 'অনুমতি পীবা',
  consentActive: '✓ অয়াবা পীরে (ঙাকশেল্লবা)',
  consentRevoked: '✕ অয়াবা লৌথোক্লে',
  revoke: 'লৌথোকপা',
  grant: 'পীবা',

  appUpdates: 'এপ্লিকেসন অপদেত',
  checkForUpdates: 'অনৌবা সংস্করন য়েংবা',
  checkingUpdates: 'য়েংলি...',
  upToDate: '✓ অপ-তু-দেত ওইরে',
  updateAvailableBanner: '🚀 অনৌবা অপদেত ফংলে!',
  downloadUpdate: 'দাউনলোদ অমসুং অপদেত APK',
  version: 'সংস্করন',

  domainMemory: 'নিংশিং শক্তা',
  domainMemoryDesc: 'কার্দ মান্নবা অমসুং নিংশিংবা',
  domainRoutine: 'নুমিৎ খুদিংগী থবক',
  domainRoutineDesc: 'নুমিৎপুংগী মতুং ইন্না থবক শিনবা',
  domainAttention: 'পুক্নিং চাংবা',
  domainAttentionDesc: 'অচেৎপা পুক্নিং চাংবা',
  domainSpeed: 'য়াংবা অমসুং থুনা তৌবা',
  domainSpeedDesc: 'তপ্না অমসুং চুম্না পাংথোকপা',
  domainCalculation: 'মশীং থীবা',
  domainCalculationDesc: 'কৈথেলগী লৈ-চাবগী মশীং',
  domainLanguage: 'লোল অমসুং ৱাহৈ',
  domainLanguageDesc: 'মৈতৈ পৌরোই অমসুং চৎনবী',
  notTestedYet: 'হৌজিক য়েংদ্রি',
  playToTestDomain: 'মসি য়েংনবা সানাথোই শান্নৌ',
  dailyGoalProgress: (current, total) => `ঙসিগী পান্দম: ${current} / ${total} সানাথোই`,
  resetAllData: 'ডেটা পুম্নমক ০ দা ওন্থোকপা',
  resetAllDataDesc: 'অরিবা স্কোর পুম্নমক মুত্থৎলগা অনৌবা ০ দা হৌদোকউ।',
  resetDataConfirm: 'নহাক্না অচুম্বরা? অরিবা ডেটা পুম্নমক মুত্থৎলগনি।',
  resetDataSuccess: '✓ ডেটা পুম্নমক ০ দা ওন্থোক্লে!',

  lpiIndexTab: 'SPI ইনদেক্স',
  progressTab: 'চাউখৎপা',
  caregiverTab: 'আশা / য়েংসিনবা',
  familySyncTab: 'ইমুংগী শম্নবা 📲',
  privacyTab: 'ডেটা ঙাকশেন',
  overallSpiScore: 'অপুনবা SPI মার্ক',
  spiScoreDesc: 'নিংশিংবা অমসুং নুমিৎ খুদিংগী থবক্তা য়ুম্ফম ওইবা।',
  ashaObservationsTitle: 'আশা ৱার্করগী য়েংশিনবা',
  ashaObs1: 'নিয়ম: নুমিৎ খুদিংগী সানাথোই শান্নরে।',
  ashaObs2: 'চাউখৎপা: তপ্না-তপ্না ফগৎলক্লি।',
  ashaObs3: 'ইমুং: থবক-থৌরম চুম্না চৎথরি।',
  historicalAccuracyTrend: 'মমাংগী চাউখৎপগী মশক',
  last10Sessions: 'অরোইবা সানাথোই ১০',
  noPlayDataYet: 'ডেটা লৈত্ৰি। অহানবা সানাথোই শান্নৌ!',
  cognitiveStabilityCurve: 'ৱাখলগী লেপহন্বা',
  stable: 'ফরি',
  stabilityDesc: 'ৱাখলগী শক্তা ফনা অমসুং লেপ্না লৈরি।',

  evidenceBasedWorkouts: 'অহলশিংগীদমক তপ্না অমসুং নিংথিনা শেম্লবা সানাথোই',
  dailyRecommendation: 'ঙসিগী তৌগদবা',
  coreCognitiveDomains: 'মরুওইবা ৱাখলগী মখলশিং',
  northEastHeritage: 'অৱাং-নোংপোক্কী চৎনবী অমসুং নিংশিংবা',
  northEastHeritageDesc: 'অসাম, বোদোলেন্দ অমসুং মনিপুরগী চৎনবীশিং',

  updateModalTitle: '🚀 অনৌবা অপদেত ফংলে!',
  updateModalDesc: 'স্মৃতি সাথীগী অনৌবা অপদেত থোরক্লে — হেন্না ফবা লোল অমসুং শক্তিগা লোয়ননা।',
  installUpdateNow: 'হৌজিক অপদেত তৌবিয়ু',
  updateDismiss: 'তুংদা',
  updateCheckPrompt: 'অনৌবা অপদেত য়েংলি...',
  noUpdateFound: 'নহাক্না অরোইবা সংস্করন শিজিন্নরি!',

  // Family Account & Pairing
  familyLink: 'ইমুং শম্নবা',
  familyAccountTitle: 'ইমুংগী একাউন্ট অমসুং শম্নবা',
  familyAccountDesc: 'অহলগী তেবলেট মচাগী মোবাইলগা শম্নহনবা',
  elderSyncCode: 'অহলগী দিভাইস কোড',
  childPhoneLabel: 'মচা / য়েংশিনবগী মোবাইল নম্বর',
  caregiverNameLabel: 'য়েংশিনবগী মমিং অমসুং মরী',
  pairAccountBtn: 'য়েংশিনবগী ফোন শম্নহনবা',
  pairedSuccess: 'ইমুংগী একাউন্ট ময়েক শেংনা শম্নরে',
  shareWhatsappReport: 'হোৱাতসএপতা নুমিৎ খুদিংগী রিপোর্ত থাবা',
  cloudSyncNow: 'ক্লাউদতা দেতা সিঙ্ক তৌবা',
};

export const translations: Record<Language, Translations> = { en, as, brx, mni };

export const languageNames: Record<Language, string> = {
  en: 'English',
  as: 'অসমীয়া',
  brx: 'बर\'',
  mni: 'মৈতৈলোন্',
};

// Bilingual names for onboarding language selection (before user has chosen a language)
export const languageNamesOnboarding: Record<Language, string> = {
  en: 'English',
  as: 'অসমীয়া (Assamese)',
  brx: 'बर\' (Bodo)',
  mni: 'মৈতৈলোন্ (Manipuri)',
};
