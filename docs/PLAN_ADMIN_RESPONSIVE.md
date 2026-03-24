# PLAN: Admin Panel Responsive & Layout Overhaul 🕵️🛠️

## 🎼 Orchestration Strategy
- **Agents**: `project-planner` (Lead), `frontend-specialist` (UI), `performance-optimizer` (Resolution), `test-engineer` (Verification).
- **Goal**: Resolve "centralized" layout issues, fix sidebar misalignment, and ensure 100% functionality (clickability) across all resolutions.

---

## 🏗️ Phase 1: Problem Analysis (Current State)
1.  **Fixed Offsets**: `Admin.tsx` uses `ml-80` for the main content, which fails on smaller screens where 320px sidebar takes up too much space.
2.  **Forced Centralization**: `max-w-6xl mx-auto` in the main shell forces content to the center, leading to empty "dead zones" and strange text wrapping on wide or narrow screens.
3.  **Clickability Failure**: High probability that some content or invisible overlays (due to `fixed` positioning and mismatched margins) are overlapping buttons.
4.  **No Mobile Support**: The sidebar has no toggle or "collapsed" state, making it unusable on mobile/tablet.

---

## 🛠️ Phase 2: Proposed Implementation

### 1. Global Shell (`src/admin/Admin.tsx` & `src/admin/AdminLayout.tsx`)
- **[REFINE]** Replace `ml-80` with a dynamic margin or a responsive container logic.
- **[REFINE]** Remove `max-w-6xl mx-auto`. Use `w-full` with flexible padding (`px-4 md:px-8 lg:px-12`).
- **[NEW]** Implement a `MobileHeader` with a Hamburger toggle for the sidebar.

### 2. Sidebar (`src/components/admin/Sidebar.tsx`)
- **[FIX]** Add responsive visibility. On mobile, it should be a drawer (`fixed inset-y-0 left-0 -translate-x-full` transition to `translate-x-0`).
- **[FIX]** Ensure the z-index is correct so it doesn't block underlying content.
- **[CLEANUP]** Sync `Sidebar` width with the `main` content margin using a CSS variable or Tailwind consistent class.

### 3. Clickability & Interactivity
- **[AUDIT]** Check all `absolute` and `fixed` elements for `pointer-events: none` where appropriate.
- **[FIX]** Ensure all buttons have proper padding and `z-index`.

---

## 🧪 Phase 3: Verification Plan

### Automated Checks
- **Lighthouse Admin Audit**: Focus on accessibility and tap targets.
- **Linting**: `npm run lint` to ensure no regressions.

### Manual Verification
- **Resolution Swapping**: Test on 320px (Mobile), 768px (Tablet), 1440px (Desktop), and 1920px (Ultra-wide).
- **Functionality Check**: Click every menu item, login/logout, and every button in `Dashboard` and `SalesPOS`.

---

## ✅ Approval Required
> [!IMPORTANT]
> The plan involves removing the "centered" look of the admin panel. The content will now start from the left (after the sidebar) and take up the available width or a larger max-width to look more professional.

**Do you approve this plan? (Y/N)**
