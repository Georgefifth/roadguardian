# UX Contract — RoadGuardian (Roadside & Crash Safety Copilot)

> Fill this before writing UI code. It is the acceptance contract for the
> frontend: if the implementation does not match this file, the implementation
> is wrong. Keep it short and specific.

## 1. Product

- **One-liner**: An offline-first, zero-login emergency copilot that shields drivers from secondary collisions, missed evidence, predatory tow truck scams, and liability traps in the critical 15 minutes after a car crash.
- **Primary user**: Everyday commuters, teen/new drivers, rideshare drivers, and highway travelers experiencing high-adrenaline panic during a breakdown or collision.
- **Job to be done**: When a vehicle collision or breakdown occurs, guide the driver safely away from traffic hazards, prevent roadside extortion scams, systematically capture bulletproof exchange evidence, and generate an insurance/police-ready incident dossier in minutes—completely offline.
- **Core success action**: The driver reaches physical safety behind the barrier, secures all 6 critical evidence items (plates, VIN, other driver, damage, skid/signals, scene), verifies the tow truck against predatory fraud, and exports an official incident summary packet.
- **What the user should never have to guess**:
  1. "Is it safe to step out of my car right now?" (Explicit safety warning: NEVER stand behind or between cars on a highway).
  2. "What questions should I ask the other driver?" (Step-by-step visual prompts).
  3. "Can I trust this tow truck driver who just pulled up?" (Defensive verification checklist + warning against signing blank forms).
  4. "What should I say?" (Neutral statement rules: state facts only, never say "I'm sorry" or speculate fault).
  5. "Did I lose my data if I refresh or lose phone signal?" (Permanent local storage indicator).

## 2. Core flow

| # | Step | User action | System feedback | Next step is obvious? |
|---|---|---|---|---|
| 1 | **Triage / Panic Entry** | Open app, tap "Start Crash Triage" or "Roadside Breakdown" | Immediate high-contrast Safety Alert HUD launches with amber hazard glow, audio chime / visual pulse | Yes, prominent primary button: "1. Secure Physical Safety" |
| 2 | **Physical Safety Check** | Verify 4 life-safety actions (Hazard lights, Engine off, Guardrail barrier positioning, Flairs/Triangle) | Interactive checkboxes; auto-detects GPS coordinates & nearest landmark for emergency calling | Yes, next button unlocks: "Proceed to Evidence Capture" |
| 3 | **Guided Evidence Vault** | Tap camera/upload slots for 6 essential items: Other Plate, Windshield VIN, Other Driver License & Insurance, 4-corner damage, Scene context | Real-time photo preview with timestamped badge, photo count (e.g. 3/6 completed), instant offline save | Yes, counter increments; next button: "Tow & Statement Shield" |
| 4 | **Tow & Statement Shield** | Review Predatory Tow Truck warning checklist & copy neutral factual incident statement template | Real-time anti-fraud badges ("Never sign blank screens", "Check City Towing Permit"); Statement builder previews formatted text | Yes, next button: "Review & Export Dossier" |
| 5 | **Incident Packet Export** | Review compiled crash packet, tap "Export Incident Packet" or "Copy Summary for Police/Insurance" | Generates single-page print/PDF ready layout and formats structured text to clipboard, SHA-256 integrity hash badge shown | Yes, clear actions: "Share / Print", "Start New Triage", "Stored in Vault" |

Target: ≤ 5 steps and ≤ 3.5 minutes from landing to the core result.

## 3. Pages

| Page / View | Purpose | Primary action | Secondary actions |
|---|---|---|---|
| **Crash Triage HUD (`/triage`)** | Immediate crisis landing, emergency dialing, GPS coordinates, life-safety checklist | "I am in a safe location (Proceed)" | Call 911 / Roadside Assist direct dial, Switch to Breakdown Mode |
| **Evidence Vault (`/evidence`)** | Step-by-step guided capture of plates, VIN, insurance, license, and damage | "Save & Continue to Shield" | Quick add voice/text memo, retake photo, remove item |
| **Tow & Statement Shield (`/shield`)** | Anti-bandit tow truck verification checklist & neutral liability statement generator | "Review Final Incident Packet" | Copy neutral statement to clipboard, verify tow truck license # |
| **Dossier Export (`/dossier`)** | Comprehensive, timestamped accident report card with photos, GPS, timestamps & checksum | "Export / Print Dossier" | Copy claim summary text, View raw JSON/hash, Return to home |
| **Offline Vault (`/vault`)** | Review previously saved incidents stored safely in browser IndexedDB/LocalStorage | "View Incident Details" | Delete record, Export backup, Create new incident |

One primary action per page. If two actions are equally important, split the page or demote one.

## 4. Required states

For every page and interactive component:

- [x] **Empty / first visit**: Clean incident dashboard showing "No active emergency. Tap 'Start Crash Triage' or try 'Interactive Simulator / Practice Mode' to prepare in advance."
- [x] **Loading**: Clear animated spinner with "Securing local vault / Reading GPS coordinates / Generating report packet...", no unresponsive dead UI.
- [x] **Success**: Amber/emerald checkmark badges, instant confirmation toast ("Photo encrypted & cached locally", "Summary copied to clipboard").
- [x] **Error**: Clear high-contrast message banner explaining the issue (e.g., "Camera access denied: You can tap 'Upload File' or manually type driver details below").
- [x] **Invalid input**: Exact field highlighted in red with contextual guidance (e.g., "VIN must be 17 characters" or "Please verify you are behind the highway barrier before continuing").
- [x] **No permission / signed out**: Fully local-first; 0 accounts or logins required. If GPS/Camera blocked, falls back gracefully to manual input and file picker.
- [x] **Mobile 390px layout**: Full touch-friendly responsive interface with sticky bottom action button (52px height) and high legibility.

## 5. Design tokens

- **Font family**:
  - Primary UI & Headings: `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif` (clean, authoritative, ultra-readable)
  - Monospace (VIN, License plates, Timestamps, Legal codes): `JetBrains Mono`, `ui-monospace`, `monospace`
- **Scale**:
  - H1: 28px / 34px (bold)
  - H2: 20px / 26px (semibold)
  - Body: 16px / 24px (regular)
  - Small / Monospace: 13px / 18px
- **Spacing scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px
- **Colors**:
  - Background Base: `#0B0F17` (Deep Obsidian Roadway, battery-efficient, glare-free at night)
  - Surface Card: `#151D2A` (Elevated Industrial Slate)
  - Surface Border: `#263447`
  - Text Primary: `#F8FAFC` (High-contrast pure bone white)
  - Text Muted: `#94A3B8` (Slate 400)
  - Hazard Amber (Primary Brand & Accent): `#F59E0B` (Roadway warning amber)
  - Danger Crimson: `#EF4444` (Emergency warning, secondary crash alert)
  - Safe Forest Emerald: `#10B981` (Completed verification, safety secured)
  - Caution Yellow: `#FBBF24`
- **Radius and borders**:
  - Cards: `rounded-xl` (12px)
  - Buttons: `rounded-lg` (8px)
  - Borders: 1px solid `#263447` with subtle amber focus ring
- **Touch target**: Minimum 52px height for all primary buttons; 48px for input fields and checklist toggles.
- **Icon style**: Stroke 2px, Lucide icon set (AlertTriangle, Shield, Camera, Truck, FileText, CheckCircle2, PhoneCall, Copy).

## 6. References

| Reference (URL or screenshot) | What to borrow | What not to copy |
|---|---|---|
| **Right After Crash** (`rightaftercrash.com`) | Guided photo checklist concept for 4 corners of car and driver info | Attorney lead-generation push, mandatory native iOS installation, ad banners |
| **NHTSA Highway Safety Protocol** (`nhtsa.gov`) | Physical safety steps (secondary crash prevention, guardrail positioning, hazard triangles) | Dry government regulatory PDF formatting |
| **AAA Roadside Emergency** (`aaa.com`) | Direct emergency dispatch and towing triage hierarchy | Mandatory membership login barrier, bloated upsell marketing |

## 7. Mobile

- **390px layout**: Single-column vertical stream, sticky bottom navigation / action bar with clear progress dots.
- **Primary action reachable without horizontal scroll**: Large full-width bottom sticky button (height: 52px, text-base font-bold) within thumb reach.
- **What is collapsed or hidden**: Detailed legal rights and state-specific tow regulations are expandable accordions; primary screen only shows actionable bullet points.
- **Keyboard behavior**: Inputs auto-scroll into view above the virtual keyboard without obscuring the next-step button.

## 8. Visual direction

- **Three adjectives**: Vigilant, High-Contrast, Reassuring (警惕、高反差、沉着安心).
- **Product archetype**: `terminal / emergency tool` (高可靠公路应急工具).
- **Palette and why it fits the domain**: Deep obsidian dark mode (`#0B0F17`) prevents nighttime screen glare while stranded on an unlit road shoulder and conserves phone battery; hazard amber (`#F59E0B`) instantly invokes emergency roadside warning lights; crimson highlights life-critical safety rules.
- **Type pairing**: `Plus Jakarta Sans` for calm, legible UI instructions + `JetBrains Mono` for VINs, license plates, GPS lat/long, and timestamps.
- **Density**: Balanced-to-dense utility. Every millimeter serves to save time, reduce panic, and prevent mistakes.
- **Signature element**: **The 4-Phase Crash Triage HUD & Anti-Bandit Tow Shield Card** (事故现场四阶段全景状态HUD + 防黑拖车电子防身盾，一眼可知当前处于避险、取证、防诈还是导出阶段，任何其他 SaaS 都不具备这一标志性元素).
- **Motion rules**: Zero decorative bounce, parallax, or spinning blobs. Fast 150ms opacity fades and status checkmark fills only.
- **Rejected clichés**: Purple gradients, glassmorphism, three-column feature cards, generic corporate KPI dashboards, playful cartoon emojis, generic marketing blob illustrations.

**Generic test:** Could this first screen be dropped into any other SaaS product without looking out of place?
*Verdict:* **No.** The high-contrast obsidian-amber palette, direct 911 / hazard dispatch button, secondary crash positioning diagrams, and anti-bandit tow truck verification seal immediately identify it as an emergency roadside safety terminal.

## 9. UX acceptance

- [x] A first-time user can explain the product's purpose within 5 seconds ("It's my roadside accident survival copilot that guides my safety, photos, and prevents tow scams").
- [x] The core task is reachable from the landing page without reading docs (Single click "Start Crash Triage" or "Roadside Breakdown").
- [x] Every action produces visible feedback within 100ms, or a loading state.
- [x] Every error says what happened and what to do next (e.g. camera denied -> fallback upload).
- [x] Empty states are actionable, not blank (shows pre-accident practice mode and quick setup).
- [x] No dead ends; no unlabeled icon-only buttons.
- [x] Desktop and mobile screenshots reviewed side by side.
- [x] The flow still works completely offline with full local data persistence.
