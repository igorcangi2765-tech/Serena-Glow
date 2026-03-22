# PLAN: Premium Team Hover Interactivity 🎼✨⚖️

## 🕵️ Phase 1: Problem Analysis
The objective is to implement a high-end visual transition for team member images in the "A Nossa Equipa" section:
- **Initial State**: Black & White (Grayscale) and slightly dimmed.
- **Hover State**: Transition to full color + subtle zoom (105%).
- **Scope**: `Home.tsx` and `About.tsx` team sections.

## 🛠️ Phase 2: Proposed Changes

### 1. `src/pages/Home.tsx` & `src/pages/About.tsx`
- **[UI]** Apply `grayscale` and `opacity-80` to the team `<img>` tags by default.
- **[UI]** Apply `group-hover:grayscale-0` and `group-hover:opacity-100` on hover.
- **[UI]** Ensure `transition-all duration-700` is present for a buttery smooth experience.
- **[REFINE]** Synchronize this with the existing `scale-105` zoom.

## 🧪 Phase 3: Verification Plan

### Automated Checks
- **Linting**: Ensure no JSX or Tailwind regressions.
- **Build**: Run a full production build to verify filter performance.

### Manual Verification
- Visual check of the "Pop" effect (grayscale to color).
- Verification that the transition is smooth and non-aggressive.
- Confirming "A Nossa Equipa" looks consistent on both Home and About pages.
