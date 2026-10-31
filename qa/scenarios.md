# RoadGuardian — QA Test Scenarios

## Overview
- **Product**: RoadGuardian (Roadside & Crash Safety Copilot)
- **Deployment URL**: `https://safespace-hacks.vercel.app`
- **Local Dev URL**: `http://localhost:5173`
- **Core User Task**: In a roadside breakdown or crash, guide driver away from secondary collisions, capture bulletproof evidence, defend against predatory tow truck extortion, and export an official tamper-evident SHA-256 incident dossier in ≤ 3.5 minutes without network connectivity.

---

## Scenario Catalog & Prioritization

### P0 — Critical Core Workflows (Blocks Core Task)

1. **`smoke-landing` (P0)**:
   - First-time user lands on `/`.
   - Title is non-empty, branding and 100% Offline indicator are visible.
   - Zero horizontal overflow (`scrollWidth <= innerWidth + 1`) on both 1440px desktop and 390px mobile viewports.
   - Emergency call buttons (911 & Roadside) and GPS coordinate display are mounted.

2. **`core-flow-end-to-end` (P0)**:
   - User initiates emergency intake.
   - **Phase 1 (Safety HUD)**: Toggles physical safety checklist items (hazards on, engine off, behind guardrail). Verifies secondary collision warning. Advances to Phase 2.
   - **Phase 2 (Evidence Vault)**: Completes driver exchange form (Name, Phone, License, Insurer, Policy, Plate, 17-char VIN). Secures photo evidence slots. Advances to Phase 3.
   - **Phase 3 (Tow & Statement Shield)**: Activates Bandit Tow Truck Defense Shield and verifies blank form refusal. Reviews live generated neutral liability statement. Advances to Phase 4.
   - **Phase 4 (Incident Dossier)**: Verifies calculated SHA-256 integrity seal, location breakdown, driver details, and print/export readiness.

3. **`state-persistence-reload` (P0)**:
   - User loads or inputs incident data (e.g. Practice Drill: Marcus Vance, US-101 crash).
   - User reloads browser page (`page.reload()`).
   - Asserts that all incident data, coordinates, checklist flags, and photo tokens survive page reload without network or backend server.

### P1 — Major Safety & Functional Features (Friction & Integrity)

4. **`tow-shield-anti-extortion` (P1)**:
   - User receives an unsolicited tow truck arrival.
   - Selects "Arrived Unsolicited" warning mode.
   - Inputs tow company and quotes hookup fee.
   - Confirms "I refused to sign any blank forms or blank screens" defensive shield.
   - Asserts that warning tags and protective shield state are enforced and documented in the dossier.

5. **`neutral-statement-generator` (P1)**:
   - Driver inputs traveling direction, speed (25 mph), and weather (fog).
   - Generated neutral statement dynamically re-renders with zero admission of liability.
   - Clicks "Copy Statement" -> clipboard toast feedback triggers.

6. **`incident-vault-lifecycle` (P1)**:
   - User opens Local Storage Vault modal.
   - Asserts existing saved incidents are listed with photo counts and timestamps.
   - Switches active incident, verifies UI refreshes immediately.
   - Tests "New Incident" button, resetting to fresh intake state.

### P2 — Accessibility & Polish

7. **`responsive-mobile-usability` (P2)**:
   - On 390px mobile viewport, all primary step buttons (`52px` height) are thumb-accessible without horizontal pan.
   - No text clippings, no overlapping badges.
   - Sticky bottom navigation flows smoothly across all 4 stages.

8. **`keyboard-navigation-tab-flow` (P2)**:
   - User tabs through interactive safety checkboxes and input fields.
   - Focus outline is clearly visible on active controls.
   - Pressing Enter / Space activates checklist toggles.
