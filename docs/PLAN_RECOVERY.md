# PLAN: Sales POS UI Recovery & Optimization

## Goal
Restore the Sales POS module to a premium, functional, and fully responsive state. Resolve the "worse than before" regression by balancing spacing, typography, and vertical real estate.

## Strategy
1.  **Identify Regressions**: The recent "ultra-compact" approach sacrificed aesthetic for space, and the grid changes caused title truncation and poor balance.
2.  **Refined Layout**: Use a more intelligent responsive layout that doesn't just "compact" everything, but resizes elements proportionally.
3.  **Typography**: Use dynamic font sizes and better line-heights to ensure titles like "Limpeza de Pele Profunda" are visible without truncation.
4.  **Height Management**: Ensure the `h-[calc(100vh-val)]` perfectly fits the viewport without clipping or excessive scrolling.

## Proposed Changes

### [Component] SalesPOS.tsx
-   **Typography**: REMOVE `hyphens-auto` and `break-words` from service titles. Use `whitespace-normal` and slightly smaller fonts (`text-lg`) to allow titles to flow naturally.
-   **Header**: Keep single-line "VENDAS/POINT OF SALE" but use `p-6` with more vertical breathing room.
-   **Services Grid**: 
    -   LIMIT to `xl:grid-cols-2` and `2xl:grid-cols-3`. Do NOT go to 4 columns, as it squashes the titles.
    -   Increase grid `gap-10` for a true premium feel.
-   **Cart Area**: 
    -   **Footer**: Restore `p-6` and `space-y-6` but slightly reduce the checkout button height to ensure it fits.
    -   **Cart Header**: Ensure the "Carrinho" title has space.
-   **Height Management**: Revert to `h-[calc(100vh-180px)]` but verify it doesn't clip on common resolutions.

### [Component] Admin.tsx (Shell)
-   Verify main content padding (`lg:px-8 lg:py-10`) doesn't compete with POS height.

## Verification Plan
1.  **Visual Audit**: Check on multiple screen sizes (1920x1080, 1366x768).
2.  **Functional Check**: Ensure all buttons (DINEIRO, M-PESA, FINALIZAR) are clickable.
3.  **Browser Tool**: (If available) Capture final screenshots.

## Agents Involved
-   `project-planner`: Architecture and task breakdown.
-   `frontend-specialist`: Implementation of POS and typography.
-   `performance-optimizer`: Layout efficiency and responsiveness.
-   `test-engineer`: Final verification.
