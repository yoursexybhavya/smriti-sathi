# 🌸 Smriti Sathi — v3.0.0

**A cognitive-stimulation and memory-care companion for elders living with dementia — offline first, in their own language, built for the people around them.**

Smart India Hackathon · SIH26003

[![Download APK](https://img.shields.io/badge/📥_Download_Android_APK-SmritiSathi--v3.0.0-0E5C50?style=for-the-badge&logo=android&logoColor=white)](https://github.com/yoursexybhavya/smriti-sathi/releases/latest)
[![Try in browser](https://img.shields.io/badge/🌐_Try_in_browser-smriti--sathi.onrender.com-C77A19?style=for-the-badge&logo=googlechrome&logoColor=white)](https://smriti-sathi.onrender.com)

---

## First run: nothing is faked

This is the most important thing to know before you open the app, and it is the first thing a judge will check.

**There is no demo data. There is no sample patient. There is no "skip to demo" button.**

A fresh install opens on a real set-up flow:

1. **Who are you?** — elder, family member, or ASHA / health worker
2. **Your name** and a **4-digit PIN** (required for anyone who will see care data, optional for the elder)
3. **The person you care for** — name, age (validated 40–120), language
4. **An emergency contact** — the number printed on the Safe Return card
5. **Comfort settings** — text size, contrast, calm-night theme

Everything after that is earned by use. An elder who has played nothing sees an honest empty state — "*no reminders set yet*", "*your progress will appear here*" — not a fabricated 14-day chart. The ASHA triage sheet says **"baseline calibrating"** until seven real sessions exist, because a stability index computed from noise would be clinically dishonest.

`Settings → Erase all data on this device` returns the install to that blank first-run state, which is what you do between two judges.

Clean-slate rehearsal takes about 90 seconds:

```bash
npm ci && npm run dev     # http://localhost:3000
```

---

## What a judge should try, in order

| # | Do this | What it proves |
|---|---|---|
| 1 | Open the app on a clean profile | Real first-run, no seeded accounts |
| 2 | Choose **Assamese / Bodo / Manipuri** before signing in | 5 complete locals, script-correct fonts, no English leakage |
| 3 | Create an elder account without a PIN | One-tap entry for someone with tremor or low vision |
| 4 | Play **Remember** one round | Errorless learning, honest timer, adaptive level |
| 5 | Open **Reminders → Add reminder** | Real scheduling + notifications, not a mock list |
| 6 | Press **SOS** | Safe Return card with the guardian number *you* entered, 112 + Elderline 14567 |
| 7 | Sign out, create a **family** account with PIN 4 digits | PIN gate is real, hashed, and blocks care data |
| 8 | Sign out, sign back in with a **wrong PIN** | Gentle, localised failure — no stack trace, no lockout trap |
| 9 | Turn on **airplane mode** and repeat 4–5 | Everything keeps working; IndexedDB is the source of truth |
| 10 | **Settings → Erase everything → type ERASE** | Device returns to first run for the next judge |

---

## The product

**For the elder** — four errorless-learning activities (Remember, Recognise, Memory Match, Daily Routine), a family album with faces and voice, gentle reminders, a progress page that only reports what actually happened, and a persistent SOS chip.

**For the family** — a care dashboard with adherence, activity and domain trends, reminder management, the family album, and the two emergency artefacts that matter on the street: the **Safe Return card** (guardian call, WhatsApp GPS beacon, 112, Elderline 14567, offline QR) and a printable **CR80 medical badge** (85.6 × 54 mm).

**For the ASHA worker** — a triage sheet computed from that elder's own sessions: 14-session median, domain breakdown, reminder adherence, and a printable / WhatsApp export that is explicitly **non-diagnostic**.

**Clinical guard-rails** — the SPI engine needs a 14-session moving median, a drop of more than 2 SD, *and* sustained missed routine care before it suggests a human check-in. One bad day never raises an alarm.

---

## Design language — "Warm Heritage Care"

Warm ivory canvas `#FBF6EE`, deep teal ink `#0E5C50`, saffron `#C77A19` and terracotta `#B4432B` drawn from the brand mark. Fraunces for headings, Plus Jakarta Sans for interface, Noto Devanagari + Bengali self-hosted so every script renders offline. Light and calm-night dark themes. Touch targets 52 / 60 / 72 px. Phone dock, tablet rail and a 1240 px desktop sidebar from one navigation definition.

The root cause of the previous interface looking broken was an **unlayered global reset** that silently zeroed every Tailwind spacing utility. All global CSS now lives in `@layer base` / `@layer components` — see `src/styles/`.

---

## Stack

React 18 · TypeScript 5.7 · Vite 6 · Tailwind v4 · Dexie (IndexedDB) · Capacitor 8 (Android) · self-hosted i18n (en, hi, as, brx, mni) · Playwright verification harness.

```
src/
  pages/        elder, caregiver, onboarding, auth, diagnostics
  games/        shared game engines + family quiz
  ui/           design-system primitives (Button, Card, Sheet, Feedback…)
  styles/       tokens.css · base.css · components.css
  i18n/         five locales, key-for-key
  services/     account, auth, reminders, safety, adaptive engine, SPI
  database/     Dexie repositories
tests/          8 suites · Tier 1–5, SPI baseline, SIH emergency
```

---

## Commands

```bash
npm ci                # install
npm run dev           # dev server on :3000
npm run build         # production build -> dist/
npm test              # 8 suites: feature, boundary, pairwise, journey, adversarial, SIH
npx cap sync android  # sync the web build into the Android project
```

Release APK: push to `main` → **Actions → Build Android APK** (JDK 21, Gradle, signed debug APK attached to the GitHub release).

---

## Honest limits

* Offline-first by design: the trust boundary is the device. PINs are salted + hashed, sessions expire, roles are enforced in the router — but a hosted deployment would move this to a server with OAuth2/JWT.
* A 4-digit PIN has a tiny keyspace; it protects care data from a curious grandchild, not from a determined attacker.
* The SPI output is a **prompt for human review**, never a diagnosis, and the app says so on every screen that shows it.
* Fall detection and BLE mesh sync exist as research scaffolding only and are not part of the demonstrated product.

---

<div align="center">

Built for the elders who taught us everything, and for the families holding on.

</div>
