# PLAN: Deployment Readiness Audit & Cleanup

## 🎯 Goal
Ensure the Serena Glow Beauty Studio application is error-free, optimized, and professionally polished for production. This involves removing dead code, resolving type/lint issues, standardizing translations, and auditing security keys.

---

## 🏗️ Audit & Cleanup Areas

### 1. 🔍 Code Quality & Static Analysis
- **Action**: Run `lint_runner.py` and `tsc` to find all errors/warnings.
- **Goal**: Zero critical errors. Cleanup unused imports and variables.

### 2. 🚮 Dead Code & Duplication removal
- **Action**: Search for redundant components (e.g., duplicated POS logic or older versions of Services).
- **Goal**: Consolidate into a single, clean architecture.

### 3. 🌍 Translation & I18n
- **Action**: Verify all user-facing strings are correctly mapped to `pt` and `en`.
- **Goal**: No hardcoded "Lorem Ipsum" or English fragments in the Portuguese UI.

### 4. 🔑 Key & Environment Audit
- **Action**: Audit `.env` and `supabase.ts`. Ensure no "mortas" (dead/invalid) keys are hardcoded.
- **Goal**: Only valid, production-ready environment variables.

### 5. 🧹 Component Sync
- **Action**: Ensure `Gallery.tsx`, `Services.tsx`, and `SalesPOS.tsx` all use the same `api.ts` pattern and error handling.

---

## 🎼 Orchestration Steps

### Phase 1: Research & Discovery
- [ ] **explorer-agent**: Identify unused files and duplicated logic.
- [ ] **test-engineer**: Run full lint/type suite.

### Phase 2: Implementation (Cleanup)
- [ ] **frontend-specialist**: Resolve translation gaps and fix UI duplications.
- [ ] **backend-specialist**: Cleanup unused routes or placeholder logic in `server/index.ts`.

### Phase 3: Final Verification
- [ ] Run `security_scan.py`.
- [ ] Run `checklist.py`.

---

## ✅ Final Success Criteria
- [ ] Build passes without warnings.
- [ ] No duplicated logic in core modules (Sales, Services, Clients).
- [ ] All translations are 100% complete.
- [ ] Production environment variables are correctly structured.
