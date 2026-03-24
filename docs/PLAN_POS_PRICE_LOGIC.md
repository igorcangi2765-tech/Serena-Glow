# PLAN: POS Price Logic & Display Refinement

## 🎯 Goal
Fix the incorrect "Total Bruto" logic and implement a transparent price breakdown in the POS cart. The goal is to ensure the user can verify the math (Subtotal - Discount + Tax = Total Final) in 2 seconds.

---

## 🏗️ Technical Implementation

### 1. [Calculation Logic]
- **Subtotal**: `cart.reduce((acc, item) => acc + item.price * item.quantity, 0)`.
- **Discount**: Dynamic state (default 0).
- **Tax**: Dynamic state (default 0).
- **Total Final**: `subtotal - discount + tax`.

### 2. [UI Components]
- **Subtotal Row**: Always visible. Label: "Subtotal".
- **Discount Row**: Visible ONLY if `discount > 0`. Label: "Desconto". Format: `- XXX MZN`.
- **Tax Row**: Visible ONLY if `tax > 0`. Label: "Taxa de Serviço" or "Imposto". Format: `+ XXX MZN`.
- **Divider**: Subtle separator before Total Final.
- **Total Final Area**:
    - Label: "Total Final".
    - Price: `text-4xl` (36px) bold.

---

## 🎼 Orchestration Steps

### Phase 1: Planning (Current)
- [x] Analyze `SalesPOS.tsx` calculation logic.
- [x] Create `docs/PLAN_POS_PRICE_LOGIC.md`.

### Phase 2: Implementation (Pending)
- [ ] **frontend-specialist**: Update `SalesPOS.tsx` with corrected variables and dynamic rows.
- [ ] **test-engineer**: Verify that the sum always matches the displayed final total.

---

## ✅ Verification Criteria
- [ ] NO "Total Bruto" label.
- [ ] "Subtotal" label matches the sum of items.
- [ ] Hidden lines for zero values (Discount/Tax).
- [ ] Consistent branding (Pink/Neutral).
