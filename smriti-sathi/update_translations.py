import re

with open('src/i18n/translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Translations Interface
interface_keys = """
  // Onboarding
  incorrectPin: string;
  enterElderName: string;
  enterValidAge: string;
  enterPin: string;
  step1Label: string;
  step2Label: string;
  step3ElderLabel: string;
  step3CaregiverLabel: string;
  next: string;
  whoIsUsing: string;
  iAmElder: string;
  elderModeDesc: string;
  familyMember: string;
  caregiverModeDesc: string;
  back: string;
  continueBtn: string;
  tellUsYourName: string;
  enterNamePlaceholder: string;
  startApp: string;
  dailyCareReminders: string;
  morningMedicine: string;
  drinkWater: string;
  memoryGameTime: string;
  setCaregiverPin: string;
  pinExplanation: string;
  elderNameLabel: string;
  ageLabel: string;
}"""
content = re.sub(r'  namePrompt: string;\n\}', f'  namePrompt: string;\n{interface_keys}', content)

# 2. Update all language blocks
def add_keys_to_block(match):
    lang_name = match.group(1)
    new_keys = """
  // Onboarding
  incorrectPin: 'Incorrect PIN. Please try again.',
  enterElderName: 'Please enter the elder\\'s name',
  enterValidAge: 'Please enter a valid age',
  enterPin: 'Please set a 4-digit PIN for caregiver access',
  step1Label: 'Step 1 of 3: Choose Language',
  step2Label: 'Step 2 of 3: Who is using this device?',
  step3ElderLabel: 'Step 3 of 3: Your Name',
  step3CaregiverLabel: 'Step 3 of 3: Elder Profile Setup',
  next: 'Next',
  whoIsUsing: 'Who will be using this device?',
  iAmElder: 'I am the Elder',
  elderModeDesc: 'Big buttons, voice guidance, and daily memory games.',
  familyMember: 'Family Member / ASHA Worker',
  caregiverModeDesc: 'Set up elder profile, care reminders, and view memory check trends.',
  back: 'Back',
  continueBtn: 'Continue',
  tellUsYourName: 'What is your name?',
  enterNamePlaceholder: 'Your name',
  startApp: 'Start',
  dailyCareReminders: 'Daily Care Reminders',
  morningMedicine: 'Morning Medicine',
  drinkWater: 'Drink Water',
  memoryGameTime: 'Memory Game Time',
  setCaregiverPin: 'Set a 4-digit PIN for caregiver access',
  pinExplanation: 'This PIN protects the caregiver dashboard from accidental access.',
  elderNameLabel: 'Elder\\'s Name',
  ageLabel: 'Age',
"""
    return f"const {lang_name}: Translations = {{{new_keys}\n  appName:"

content = re.sub(r'const (en|as|brx|mni): Translations = \{\n\s*appName:', add_keys_to_block, content)

# 3. Update languageNames
content = content.replace(
"""export const languageNames: Record<Language, string> = {
  en: 'English',
  as: 'অসমীয়া (Assamese)',
  brx: 'बर\\' (Bodo)',
  mni: 'মৈতৈলোন্ (Manipuri)',
};""",
"""export const languageNames: Record<Language, string> = {
  en: 'English',
  as: 'অসমীয়া',
  brx: 'बर\\'',
  mni: 'মৈতৈলোন্',
};

export const languageNamesOnboarding: Record<Language, string> = {
  en: 'English',
  as: 'অসমীয়া (Assamese)',
  brx: 'बर\\' (Bodo)',
  mni: 'মৈতৈলোন্ (Manipuri)',
};""")

with open('src/i18n/translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

