# Implementation Plan: Project Refactoring & Cleanup

The goal is to move from a "development/prototype" state to a "production-ready" clean codebase by unifying patterns, removing legacy code, and enforcing type safety.

## 1. Core Utilities & Infrastructure
- [ ] **Unify DB Connection**: Standardize on `lib/db/connect.ts`. Rename `connectToDatabase` to `connectDB` throughout the project.
- [ ] **Auth & Business Layer**: Centralize `getActiveBusiness` and `getOrCreateBusiness` logic into a single server utility that handles Clerk auth and business context.
- [ ] **Action Response Type**: Define a standard `{ success: boolean; data?: T; error?: string }` type for all server actions.

## 2. Legacy Code Removal
- [ ] **Content Planner**: Delete `components/content-planner` (older version). All active dev is in `components/calendar/content-planner`.
- [ ] **Old Calendar**: Review the `content calendar` root folder and archive/delete if no longer needed.
- [ ] **Unused Components**: Scan `components/` for any files not imported in the current app tree (e.g. `CustomHTMLRenderer.tsx`? `PaymentSupport.tsx`?).

## 3. Server Actions Refactoring
- [ ] **Content Planner Actions**: Refactor `lib/actions/content-planner/post.actions.ts`.
    - Replace `any` with strong types.
    - Use a shared `normalizePostData` helper.
    - Implement the standard action response pattern.
- [ ] **Booking Actions**: Standardize `lib/actions/booking.actions.ts` to use the unified business helper.

## 4. UI/UX Component Cleanup
- [ ] **Consistent Imports**: Standardize on `@/` aliases.
- [ ] **Standardize Theme usage**: Ensure all new components use the design tokens established in the landing page (e.g. `hsl` values, sleek dark modes).
- [ ] **Clerk Components**: Ensure `SignedIn`/`SignedOut` and `UserButton` are used consistently across the dashboard.

## 5. Type Safety
- [ ] Create `types/index.ts` to export all shared interfaces.
- [ ] Implement Mongoose interface types for all models.

## 6. Access Control (Middleware)
- [ ] Clean up `middleware.ts`. replace commented-out code with a clean `BYPASS_RBAC` environment variable check or a more structured permission system.
