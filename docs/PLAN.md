# Orchestration Plan: SalesPOS Final Polish

The user is still experiencing issues with the SalesPOS cart items being too small, showing in the background, and having a "black opacity" overlay. We will use a multi-agent approach to resolve this.

## Phase 1: Planning and Discovery
- **Agent**: `project-planner` + `explorer-agent`
- **Task**: Identify all CSS classes and components contributing to the "black opacity" and "small font" look. Trace the `AnimatePresence` and `motion.div` styles for the cart.

## Phase 2: Implementation (Parallel)
- **Agent**: `frontend-specialist`
- **Task**: 
    - Remove the `bg-black/40` overlay if it's the target.
    - Increase cart item font sizes to `text-lg` for names and `text-base` for details.
    - Change grid layout to a more spacious 2-row or 2-column stacked layout per item.
    - Ensure `z-index` of professional selector is at least `50+`.
- **Agent**: `debugger`
- **Task**: Check for any `opacity` or `filter: blur` properties applied to the cart container or its children.

## Phase 3: Verification
- **Agent**: `test-engineer`
- **Task**: Verify the layout doesn't clip on common screen sizes after the size increase.

## Deliverables
- [ ] Fixed `SalesPOS.tsx` with large, clear item list.
- [ ] No dark overlays obscuring the view.
- [ ] Responsive professional selector.
