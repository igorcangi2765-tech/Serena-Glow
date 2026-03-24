# ORCHESTRATION PLAN: Serena Glow Admin & POS Repair

The user reports that the Admin panel is currently showing errors and requested UI updates (Login, SalesPOS Cart) are not reflecting. This plan outlines a 3-agent approach to debug and resolve these issues systematically.

## 🤖 Agents
1. **debugger**: Identify syntax errors or runtime exceptions in the updated `SalesPOS.tsx` and `Admin.tsx`.
2. **frontend-specialist**: Ensure the premium glassmorphic login and cart UI are correctly rendered and integrated with the state.
3. **backend-specialist**: Verify that all new `/api` endpoints (profiles, clients/search, etc.) are correctly handling requests.

---

## Phase 1: Debugging & Discovery
- [ ] Run `npm run lint` or `lint_runner.py` to identify syntax errors introduced during the API migration.
- [ ] Check `server/index.ts` to ensure all endpoints have parity with the new frontend logic.
- [ ] Verify if the application is being served on a non-standard port that blocks the UI updates.

## Phase 2: Implementation (Wait for Approval)
- [ ] **SalesPOS**:
    - [ ] Fix any syntax or type errors in the cart logic.
    - [ ] Complete the migration of all remaining `supabase` calls to the `api` utility.
- [ ] **Login**:
    - [ ] Ensure the glassmorphic container is properly applied in both `Admin.tsx` and `Login.tsx`.
    - [ ] Verify theme synchronization (Light/Dark mode) for the login portal.
- [ ] **Agenda & Inbox**:
    - [ ] Ensure the booking grid and inbox spacing refinements are functional.

## Phase 3: Final Verification
- [ ] Run `python .agent/scripts/checklist.py .` for final audits.
- [ ] Verify frontend/backend connectivity on port 3000/3001.

---
✅ **Plan created. Do you approve? (Y/N)**
