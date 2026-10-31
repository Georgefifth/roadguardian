# Playwright QA Report — 2026-10-31T08:42:35.915Z

- **Base URL Tested**: https://safespace-hacks.vercel.app
- **Browser**: chromium (headless)
- **Total Scenarios**: 10
- **Pass**: 6
- **Fail**: 4

| Viewport | Scenario ID | Status | Duration (ms) | Detail |
|---|---|---|---|---|
| desktop | smoke-landing | PASSED | 1123 | All assertions passed, zero console errors |
| desktop | core-flow-end-to-end | FAILED | 10479 | locator.waitFor: Timeout 10000ms exceeded.
Call log:
[2m  - waiting for getByText(/Secured/i).first() to be visible[22m
[2m    24 × locator resolved to hidden <span class="truncate text-slate-400 hidden xs:inline">Secured</span>[22m
 |
| desktop | state-persistence-reload | PASSED | 3236 | All assertions passed, zero console errors |
| desktop | tow-shield-anti-extortion | PASSED | 298 | All assertions passed, zero console errors |
| desktop | incident-vault-lifecycle | PASSED | 720 | All assertions passed, zero console errors |
| mobile | smoke-landing | FAILED | 235 | horizontal overflow detected: 244px |
| mobile | core-flow-end-to-end | FAILED | 10589 | locator.waitFor: Timeout 10000ms exceeded.
Call log:
[2m  - waiting for getByText(/Secured/i).first() to be visible[22m
[2m    24 × locator resolved to hidden <span class="truncate text-slate-400 hidden xs:inline">Secured</span>[22m
 |
| mobile | state-persistence-reload | PASSED | 3282 | All assertions passed, zero console errors |
| mobile | tow-shield-anti-extortion | PASSED | 312 | All assertions passed, zero console errors |
| mobile | incident-vault-lifecycle | FAILED | 10673 | locator.waitFor: Timeout 10000ms exceeded.
Call log:
[2m  - waiting for getByText(/1. Life Safety/i).first() to be visible[22m
[2m    24 × locator resolved to hidden <span class="text-xs font-semibold truncate hidden sm:inline text-hazard-400">1. Life Safety</span>[22m
 |

## Visual Screenshot Evidence

- `evidence/stage-3-qa/screens/smoke-landing-landing-desktop.png`
- `evidence/stage-3-qa/screens/core-flow-end-to-end-phase1-safety-secured-desktop.png`
- `evidence/stage-3-qa/screens/state-persistence-reload-persistence-after-reload-desktop.png`
- `evidence/stage-3-qa/screens/tow-shield-anti-extortion-tow-shield-unsolicited-alert-desktop.png`
- `evidence/stage-3-qa/screens/incident-vault-lifecycle-vault-modal-open-desktop.png`
- `evidence/stage-3-qa/screens/incident-vault-lifecycle-vault-new-session-desktop.png`
- `evidence/stage-3-qa/screens/core-flow-end-to-end-phase1-safety-secured-mobile.png`
- `evidence/stage-3-qa/screens/state-persistence-reload-persistence-after-reload-mobile.png`
- `evidence/stage-3-qa/screens/tow-shield-anti-extortion-tow-shield-unsolicited-alert-mobile.png`
- `evidence/stage-3-qa/screens/incident-vault-lifecycle-vault-modal-open-mobile.png`
