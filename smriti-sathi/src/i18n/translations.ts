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

  // Home
  welcomeBack: string;
  letsPlay: string;
  todayGames: string;
  noGamesToday: string;

  // Games
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
  tryAgain: string; // Encouraging, not punishing
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

  // Caregiver
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

  // Settings
  language: string;
  textSize: string;
  normal: string;
  large: string;
  consent: string;
  consentGranted: string;
  revokeConsent: string;
  grantConsent: string;
}

const en: Translations = {
  appName: 'Smriti Sathi',
  appTagline: 'Memory care that speaks your language',
  home: 'Home',
  games: 'Games',
  reminders: 'Reminders',
  settings: 'Settings',
  caregiver: 'Caregiver',
  welcomeBack: 'Welcome back!',
  letsPlay: "Let's play!",
  todayGames: 'Games played today',
  noGamesToday: 'No games played yet today',
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
  dismiss: 'Done',
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
  language: 'Language',
  textSize: 'Text Size',
  normal: 'Normal',
  large: 'Large',
  consent: 'Data Consent',
  consentGranted: 'You have given consent to store your activity data',
  revokeConsent: 'Revoke Consent',
  grantConsent: 'Grant Consent',
};

const as: Translations = {
  appName: 'স্মৃতি সাথী',
  appTagline: 'আপোনাৰ ভাষাত স্মৃতি যত্ন',
  home: 'ঘৰ',
  games: 'খেল',
  reminders: 'সোঁৱৰণী',
  settings: 'ছেটিংছ',
  caregiver: 'যত্নকাৰী',
  welcomeBack: 'পুনৰ স্বাগতম!',
  letsPlay: 'আহক খেলো!',
  todayGames: 'আজি খেলা খেল',
  noGamesToday: 'আজি এতিয়ালৈকে কোনো খেল খেলা হোৱা নাই',
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
  dismiss: 'হৈ গ\'ল',
  caregiverDashboard: 'যত্নকাৰীৰ ডেছব\'ৰ্ড',
  engagementSummary: 'সংযোগৰ সাৰাংশ',
  gamesPlayed: 'খেলা খেল',
  totalTime: 'মুঠ সময়',
  accuracy: 'শুদ্ধতা',
  reminderAdherence: 'সোঁৱৰণী পালন',
  performanceTrend: 'প্ৰদৰ্শনৰ ধাৰা',
  noDataYet: 'এতিয়ালৈকে কোনো তথ্য নাই',
  lastDays: 'শেষ ৭ দিন',
  alerts: 'সতৰ্কতা',
  noAlerts: 'কোনো সতৰ্কতা নাই — সকলো ঠিকে আছে!',
  language: 'ভাষা',
  textSize: 'আখৰৰ আকাৰ',
  normal: 'সাধাৰণ',
  large: 'ডাঙৰ',
  consent: 'তথ্যৰ সন্মতি',
  consentGranted: 'আপুনি আপোনাৰ কাৰ্যকলাপৰ তথ্য সংৰক্ষণৰ সন্মতি দিছে',
  revokeConsent: 'সন্মতি প্ৰত্যাহাৰ কৰক',
  grantConsent: 'সন্মতি দিয়ক',
};

// Bodo translations (Devanagari script)
const brx: Translations = {
  appName: 'स्मृति साथी',
  appTagline: 'नोंथाइनि रावओ सायाव',
  home: 'नोगोरजों',
  games: 'गेलेनाय',
  reminders: 'मोनहोनाय',
  settings: 'गोरोबथा',
  caregiver: 'सायखांनायगिरि',
  welcomeBack: 'फैगौ मोनसे ओंखारलाय!',
  letsPlay: 'हाय गेलेनो!',
  todayGames: 'दिनै गेलेनाय',
  noGamesToday: 'दिनै गेलेनाय जायाखै',
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
  dismiss: 'जादों',
  caregiverDashboard: 'सायखांनायगिरिनि डेसबर्ड',
  engagementSummary: 'लोगोसे दाबनायनि सारांश',
  gamesPlayed: 'गेलेनाय',
  totalTime: 'जेराव समाय',
  accuracy: 'गोरोब',
  reminderAdherence: 'मोनहोनाय मानि',
  performanceTrend: 'खामानिनि गति',
  noDataYet: 'एसे तक data गैयि',
  lastDays: 'जोबथा ७ सान',
  alerts: 'सावगारि',
  noAlerts: 'सावगारि गैयि — गासैबो मोजां!',
  language: 'राव',
  textSize: 'हांखोनि महर',
  normal: 'गुबुन',
  large: 'गेदेर',
  consent: 'डाटा अनुमति',
  consentGranted: 'नों data सेव खालामनायनि अनुमति होदों',
  revokeConsent: 'अनुमति फिन लानाय',
  grantConsent: 'अनुमति होनाय',
};

// Manipuri translations (we'll use Bengali script as fallback since Meetei Mayek support varies)
const mni: Translations = {
  appName: 'স্মৃতি সাথী',
  appTagline: 'নহাক্কী লোনদা পাম্বৈ',
  home: 'য়ুম',
  games: 'সানাথোই',
  reminders: 'নিংশিংহন্বা',
  settings: 'সেটিংস',
  caregiver: 'য়েংসিনবা',
  welcomeBack: 'অমুক ওকচরি!',
  letsPlay: 'সানাথোই শানসি!',
  todayGames: 'ঙসি সানাথোই শান্নরবশিং',
  noGamesToday: 'ঙসি সানাথোই অমত্তা শান্নদ্রি',
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
  dismiss: 'ওইরে',
  caregiverDashboard: 'য়েংসিনবগী ডেসবোর্ড',
  engagementSummary: 'শরুক য়াবগী মশক',
  gamesPlayed: 'শান্নরবা সানাথোই',
  totalTime: 'পুম্নমক মতম',
  accuracy: 'অচুম্বা',
  reminderAdherence: 'নিংশিংহন্বা ইন্নরবা',
  performanceTrend: 'তৌবিবগী মখল',
  noDataYet: 'হৌজিক ফংনদ্রে',
  lastDays: 'মঙাতানিরবা নুমিৎ ৭',
  alerts: 'চেকশিন্নবা',
  noAlerts: 'চেকশিন্নবা লৈতে — পুম্নমক ফজরি!',
  language: 'লোল',
  textSize: 'ইয়েক চাওনা',
  normal: 'গুনবাল',
  large: 'অচৌবা',
  consent: 'ডেটা অনুমতি',
  consentGranted: 'নহাক্না তৌরবশিংগী ডেটা থম্নবা অয়াবা পীরে',
  revokeConsent: 'অনুমতি লৌথোকপা',
  grantConsent: 'অনুমতি পীবা',
};

export const translations: Record<Language, Translations> = { en, as, brx, mni };

export const languageNames: Record<Language, string> = {
  en: 'English',
  as: 'অসমীয়া (Assamese)',
  brx: 'बर\' (Bodo)',
  mni: 'মৈতৈলোন্ (Manipuri)',
};
