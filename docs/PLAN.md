# PLAN: Fix Light Mode Contrast Bug 🎼⚖️

## 🕵️ Phase 1: Problem Analysis
The "Marcar Agora" buttons on the Services page exhibit a contrast bug in Light Mode, where the button background/text becomes invisible or near-invisible, especially during hover states. This is caused by:
1.  **Missing Design Tokens**: `Services.tsx` references `var(--pink-500)` in Framer Motion's `whileHover`, but this variable is not defined in `index.css`.
2.  **Inconsistent Styling**: Hover states in `whileHover` are competing with Tailwind's `hover:` classes, leading to unpredictable rendering in Light Mode.
3.  **Color Variable Misalignment**: The project uses a custom `@theme` but attempts to use standard Tailwind variable naming in JS.

## 🛠️ Phase 2: Proposed Changes

### 1. `src/index.css`
- Ensure essential color variables are correctly mapped for both CSS and JS access.
- Define `--color-pink-500` if necessary, or standardize on existing `--color-deep-rose`.

### 2. `src/pages/Services.tsx`
- **[FIX]** Update `whileHover` to use valid CSS variables (`var(--color-pink-500)` or `var(--color-deep-rose)`) or direct hex values consistent with the theme.
- **[REFINE]** Synchronize button styles with the premium "Serena Glow" design language (pink-500/rose-500 gradients).
- **[CLEANUP]** Remove redundant or conflicting `hover:` classes when using Framer Motion for state management.

### 3. `src/pages/Home.tsx`
- Audit the "Services Preview" section to ensure the same bug doesn't exist in the small cards.

## 🧪 Phase 3: Verification Plan

### Automated Checks
- Run `npm run lint` to catch any remaining theme variable issues.
- Verification of accessibility (contrast ratios) for the fixed buttons.

### Manual Verification
- Visual check in both Light and Dark modes.
- Hover state verification across all service cards.
