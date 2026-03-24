# PLAN: POS Cart UI Refinement (Orchestrated)

## 🎯 Goal
Refine the POS cart to achieve a professional, focused, and brand-consistent UI. This involves standardizing colors to the Pink/Neutral palette, creating a dominant checkout hierarchy, and improving card structure for better clarity.

## 🎨 Design System (Restricted)
- **Primary**: Pink (`pink-600`, `pink-500`)
- **Neutral**: Grays/Zinc for text and secondary backgrounds.
- **Forbidden**: Non-brand highlights (Orange, Red, Blue) except for critical alerts.

---

## 🔧 Component Breakdown

### 1. [Cart Sidebar Structure]
- Ensure 100vh height with a clean border-left separator.
- Maintain the hybrid scrolling (Fixed Header/Footer, Scrollable Items).

### 2. [Cart Item Cards]
- **Background**: `bg-white/90 dark:bg-zinc-800/90` with subtle elevation.
- **Padding**: Increase internal padding to `p-5`.
- **Spacing**: Increase element gap to `gap-3`.
- **Legibility**: 
    - Service Name: `font-bold text-gray-900`.
    - Price: Highlighted in `pink-600`.

### 3. [Checkout Footer & Total]
- **Total Bruto**: Move ABOVE the final total. Make it `text-xs gray-400`.
- **TOTAL FINAL**: 
    - Label: `text-xs uppercase font-bold text-gray-500`.
    - Price: `text-4xl font-black text-pink-600`.
- **Hierarchy**: The final total price must be the most dominant numerical element in the entire sidebar.

### 4. [Payment Methods]
- **Standardization**: All method buttons must have the same dimensions.
- **Color Reset**: Remove specific brand colors (Orange from E-Mola, Blue from Cartão).
- **Selected State**: 
    - Border: `border-pink-500`.
    - Background: `bg-pink-50` (Light) / `bg-pink-500/10` (Dark).
    - Text/Icon: `text-pink-600`.

### 5. [Finalize Button]
- Strong `bg-pink-600`.
- Precise hover (`hover:bg-pink-700`) and active (`active:scale-95`) states.

---

## 🎼 Orchestration Checklist

### Phase 1: Planning (Done)
- [x] Analyze current `SalesPOS.tsx`
- [x] Create `docs/PLAN_POS_CART_REFINEMENT.md`

### Phase 2: Implementation (Pending Approval)
- [ ] **frontend-specialist**: Implement JSX/CSS changes in `SalesPOS.tsx`.
- [ ] **performance-optimizer**: Audit scroll smoothness and layout stability.
- [ ] **test-engineer**: Verify payment selection logic and checkout flow.

---

## ✅ Verification Criteria
- [ ] No orange or blue highlights in payment methods.
- [ ] Cart cards have distinct elevated background.
- [ ] Total Final is clearly larger than Total Bruto.
- [ ] All buttons respond with visual feedback.
