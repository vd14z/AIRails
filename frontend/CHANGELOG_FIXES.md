# Frontend Changelog - Chakra UI v3 Migration

This document tracks the fixes and changes made during the migration to Chakra UI v3.

## Overview

Migrated from Chakra UI v2.8 to v3.29.0, which introduced significant breaking changes requiring component replacements and API updates.

## Version Updates

- **Chakra UI**: 2.8 → 3.29.0
- **@chakra-ui/color-mode**: Added 2.2.0
- **React**: 19.2.0 → 18.3.1 (for Storybook compatibility)
- **Vite**: 7.2.2 → 5.2.0 (for Storybook compatibility)

## Breaking Changes and Fixes

### Theme Configuration

**Issue**: `extendTheme` and `ThemeConfig` are deprecated in v3.

**Fix**: 
- Replaced `extendTheme` with `createSystem` and `defaultConfig`
- Updated `src/theme/index.ts` to use new API
- Updated `src/main.tsx` to pass system via `value` prop to `ChakraProvider`

**Files Changed**:
- `src/theme/index.ts`
- `src/main.tsx`

### Color Mode

**Issue**: `useColorMode` and `useColorModeValue` moved to separate package.

**Fix**:
- Installed `@chakra-ui/color-mode@2.2.0`
- Updated imports in `src/layouts/DashboardLayout.tsx`
- Replaced `ColorModeScript` with `defaultColorMode` prop

**Files Changed**:
- `src/layouts/DashboardLayout.tsx`
- `src/main.tsx`

### Deprecated Components

#### Card and CardBody

**Issue**: `Card` and `CardBody` components removed.

**Fix**: Replaced with `Box` component with inline styles.

**Files Changed**:
- `src/components/ui/StatCard.tsx`
- `src/components/ui/AiInsightCard.tsx`
- `src/features/pipeline/components/CandidateCard.tsx`
- `src/features/pipeline/pages/PipelinePage.tsx`
- `src/features/executive-summary/pages/ExecutiveSummaryPage.tsx`

#### Alert Components

**Issue**: `Alert`, `AlertTitle`, `AlertDescription`, `AlertIcon` removed.

**Fix**: Replaced with `Box` and `Text` components with equivalent styling.

**Files Changed**:
- `src/components/feedback/PromptGuard.tsx`
- `src/features/job-generator/pages/JobGeneratorPage.tsx`

#### Switch

**Issue**: `Switch` component removed.

**Fix**: Created custom toggle switch using `Box` component with state management.

**Files Changed**:
- `src/components/feedback/PromptGuard.tsx`

#### Tag Components

**Issue**: `Tag`, `TagLeftIcon`, `TagLabel` removed.

**Fix**: Replaced with `Badge` or `HStack` with `Icon` and `Text`.

**Files Changed**:
- `src/components/ui/AiInsightCard.tsx`

#### Form Components

**Issue**: `FormControl` and `FormLabel` removed.

**Fix**: Replaced with `VStack` and `Text` components.

**Files Changed**:
- `src/features/pipeline/pages/PipelinePage.tsx`
- `src/features/job-generator/components/PromptBuilder.tsx`

#### Divider

**Issue**: `Divider` component removed.

**Fix**: Replaced with `Box` using `borderTop` and spacing props.

**Files Changed**:
- `src/features/job-generator/components/PreviewPanel.tsx`
- `src/features/insights/pages/InsightsPage.tsx`

#### Table Components

**Issue**: `Table`, `Tbody`, `Td`, `Th`, `Thead`, `Tr` removed.

**Fix**: Replaced with `VStack` and `HStack` for custom table-like layouts.

**Files Changed**:
- `src/features/executive-summary/pages/ExecutiveSummaryPage.tsx`

#### Avatar

**Issue**: `Avatar` component removed.

**Fix**: Created custom avatar using `Box` component with initials helper function.

**Files Changed**:
- `src/features/pipeline/components/CandidateCard.tsx`

#### Tooltip

**Issue**: `Tooltip` component removed.

**Fix**: Replaced with native HTML `title` attribute on wrapper `Box`.

**Files Changed**:
- `src/features/pipeline/components/CandidateCard.tsx`

#### useToast

**Issue**: `useToast` hook removed.

**Fix**: Replaced with conditional `Alert` component and local state management.

**Files Changed**:
- `src/features/job-generator/pages/JobGeneratorPage.tsx`

#### Select

**Issue**: `Select` component removed.

**Fix**: Replaced with `Box as="select"` with inline styles.

**Files Changed**:
- `src/features/pipeline/pages/PipelinePage.tsx`
- `src/features/job-generator/components/PromptBuilder.tsx`

### TypeScript Configuration

**Issue**: `verbatimModuleSyntax: true` requires explicit type imports.

**Fix**: Updated all type-only imports to use `import type` syntax.

**Files Changed**:
- `src/services/api/hooks.ts`
- `src/features/pipeline/pages/PipelinePage.tsx`
- `src/features/job-generator/pages/JobGeneratorPage.tsx`

### Component Prop Types

**Issue**: Prop types like `BadgeProps`, `CardProps`, `StackProps` no longer exported.

**Fix**: Replaced with `ComponentProps<typeof Component>` from React.

**Files Changed**:
- `src/components/ui/ScoreBadge.tsx`
- `src/components/ui/SectionHeader.tsx`
- `src/components/ui/StatCard.tsx`
- `src/components/ui/AiInsightCard.tsx`

### IconType

**Issue**: `IconType` from `react-icons` not directly exported.

**Fix**: Replaced with `ComponentType<{ size?: string | number; color?: string }>`.

**Files Changed**:
- `src/components/ui/StatCard.tsx`

## Migration Checklist

- [x] Update Chakra UI to v3.29.0
- [x] Install @chakra-ui/color-mode
- [x] Update theme configuration to use createSystem
- [x] Replace all deprecated components
- [x] Fix TypeScript import issues
- [x] Update component prop types
- [x] Test all pages and components
- [x] Update documentation

## Testing

All components have been tested and verified to work correctly with Chakra UI v3. The application should now run without errors related to deprecated components.

## References

- [Chakra UI v3 Migration Guide](https://chakra-ui.com/getting-started/migration)
- [Chakra UI v3 Documentation](https://chakra-ui.com/docs)
