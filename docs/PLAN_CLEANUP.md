# PLAN: Final Production Cleanup & Responsiveness 🎼🧹⚖️

## 🕵️ Phase 1: Problem Analysis
The objective is to transition the "Serena Glow" website from a high-velocity development state to a stable, production-ready release. This involves purging technical debt, ensuring cross-device consistency, and verifying all functional pathways.

### Key Focus Areas:
1.  **Technical Debt Purge**: Remove redundant scripts, temporary data, and dead code.
2.  **Responsiveness Audit**: Verify Navbar, Hero, and Grid behaviors on Tablet/Mobile.
3.  **Code Quality**: Fix lingering TypeScript/Lint issues and synchronize translation keys.
4.  **Deployment Verification**: Final build and security scan.

---

## 🛠️ Phase 2: Proposed Changes

### 🎼 Orchestration Strategy:
- **`explorer-agent`**: Identify and delete root-level `.cjs`, `.js`, and `.ts` utility scripts that served transition purposes.
- **`mobile-developer`**: Audit and patch `Layout.tsx`, `Home.tsx`, and `Gallery.tsx` for tablet/mobile edge cases (text overflows, spacing).
- **`seo-specialist` (Clean-up role)**: Final sanity check on metadata and 100% translation key synchronization.
- **`test-engineer`**: Execute `security_scan.py` and `lint_runner.py` for final sign-off.

### 1. Root Directory Cleanup
- **[DELETE]** `download_*.cjs`, `fetch_*.cjs`, `fix_hero.cjs`, `get_unsplash.*`, `temp_translations.*`, `unsplash_ids.json`.
- **[KEEP]** `vite.config.ts`, `tsconfig.json`, `package.json`, `.env.example`.

### 2. Responsiveness (Mobile/Tablet)
- **[VERIFY]** Navbar transition points (Hamburger visibility).
- **[VERIFY]** Service Cards (2-column on tablet, 1-column on mobile).
- **[VERIFY]** Gallery Grid (3-column on tablet, 1 or 2 on mobile).
- **[FIX]** Hero text sizes for small mobile screens.

### 3. Localization & Bug Fixes
- **[SYNC]** Ensure `pt.json` and `en.json` have identical key structures.
- **[FIX]** Any remaining console errors or build warnings.

---

## 🧪 Phase 3: Verification Plan

### Automated Checks
- `npm run build` (Ensures zero compilation errors).
- `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- `python .agent/skills/lint-and-validate/scripts/lint_runner.py .`

### Manual Verification
- Visual inspection of the "Visualizar" button behavior on tablet.
- Switch between PT/EN in all pages to detect "missing key" fallbacks.

✅ **Plan created. Ready for implementation after approval.**
