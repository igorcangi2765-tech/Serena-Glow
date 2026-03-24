# PLAN: Debug & Fix Admin Gallery

## 🎯 Goal
Fix the "Erro ao carregar galeria" issue by establishing a proper database table and a verified API flow (Frontend -> Backend -> Supabase).

---

## 🏗️ Proposed Changes

### 1. [Database]
- **Create Table**: Add `gallery` table to Supabase.
  - `id`: uuid (primary key, default: gen_random_uuid())
  - `image_url`: text (required)
  - `created_at`: timestamptz (default: now())

### 2. [Backend]
#### [MODIFY] [server/index.ts](file:///c:/Users/igorc/Downloads/Serena-Glow-Beauty-main/Serena-Glow-Beauty-main/server/index.ts)
- Add `GET /api/gallery` route:
  - Fetches all items from the `gallery` table, ordered by `created_at` DESC.
  - Returns 200 with JSON or 500 on error.
- Add `POST /api/gallery` route:
  - Handles image metadata insertions (storing the URL).

### 3. [Frontend]
#### [MODIFY] [Gallery.tsx](file:///c:/Users/igorc/Downloads/Serena-Glow-Beauty-main/Serena-Glow-Beauty-main/src/components/admin/modules/Gallery.tsx)
- Replace direct `supabase` fetch with `api.get('/api/gallery')`.
- Map backend response to the component state.
- Ensure only one error toast is shown.
- Add "Nenhuma imagem na galeria" empty state handling.

---

## 🎼 Orchestration Steps

### Phase 1: Database & Backend
- [ ] Create `gallery` table via SQL.
- [ ] Implement API routes in `server/index.ts`.

### Phase 2: Frontend Refactor
- [ ] Update `Gallery.tsx` with the new API-based flow.
- [ ] Verify image rendering and empty states.

### Phase 3: Verification
- [ ] Test the full roundtrip (Upload -> Store -> Fetch -> Display).

---

## ✅ Verification Criteria
- [ ] Gallery loads without console errors.
- [ ] Network tab shows successful 200 OK for `GET /api/gallery`.
- [ ] Empty state appears if table is empty.
- [ ] Uploaded images are correctly stored and retrieved.
