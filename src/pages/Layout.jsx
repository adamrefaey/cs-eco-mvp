/**
 * Layout.jsx - Backward Compatibility Wrapper
 *
 * This file now imports and exports the refactored AppLayout component.
 * The original 890-line god component has been split into:
 * - /src/components/AppLayout.jsx (main structure)
 * - /src/components/AppSidebar.jsx (navigation sidebar)
 * - /src/components/AppHeader.jsx (top header)
 * - /src/constants/navigation.js (navigation data)
 * - /src/styles/layout.css (extracted CSS)
 *
 * This wrapper ensures existing imports continue to work.
 */

export { default } from "@/components/AppLayout";
