# AI Talent Hub - Frontend

React 18 + TypeScript + Vite frontend application for the AI Talent Hub demo.

## Technology Stack

- **React 18.3** with functional components and hooks
- **TypeScript 5.4** with strict typing
- **Vite 5** as bundler and development server
- **Chakra UI 3.29** as the design system
- **TanStack Query** for async data handling and caching
- **Zustand** for lightweight global state management
- **React Router DOM 6.28** for client-side navigation
- **React Hook Form + Zod** for robust form handling and validation
- **Storybook 8** for component documentation

## Prerequisites

- Node.js 20.x or higher
- npm or pnpm package manager

## Setup

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Copy environment variables:
```bash
cp env.example .env
```

3. Update `.env` with your configuration:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests in watch mode
- `npm run storybook` - Start Storybook
- `npm run storybook:build` - Build Storybook

## Chakra UI v3 Migration Notes

This project uses **Chakra UI v3**, which has significant API changes from v2:

### Theme Configuration

- Use `createSystem` and `defaultConfig` instead of `extendTheme`
- Theme is passed via `value` prop to `ChakraProvider`
- Color tokens use `{ value: '#color' }` structure

### Deprecated Components

The following components have been replaced:

- **Card/CardBody** → `Box` with inline styles
- **Alert/AlertTitle/AlertDescription** → `Box` and `Text` components
- **Switch** → Custom `Box` component with toggle behavior
- **Tag/TagLeftIcon/TagLabel** → `Badge` or `HStack` with `Icon` and `Text`
- **FormControl/FormLabel** → `VStack` and `Text`
- **Divider** → `Box` with `borderTop` styling
- **Table components** → `VStack` and `HStack` for custom table layouts
- **Avatar** → Custom `Box` component with initials
- **Tooltip** → Native HTML `title` attribute
- **useToast** → Conditional `Alert` component with local state

### TypeScript Configuration

- `verbatimModuleSyntax: true` requires explicit `import type` for type-only imports
- Component prop types use `ComponentProps<typeof Component>` instead of exported prop types

### Color Mode

- Import `useColorMode` and `useColorModeValue` from `@chakra-ui/color-mode`
- Use `defaultColorMode` prop on `ChakraProvider` instead of `ColorModeScript`

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (ScoreBadge, StatCard, etc.)
│   │   └── feedback/     # Feedback-related components
│   ├── features/          # Feature-based modules
│   │   ├── pipeline/     # Candidate pipeline feature
│   │   ├── job-generator/ # Job description generator
│   │   ├── executive-summary/ # Executive summary feature
│   │   └── insights/      # AI insights feature
│   ├── layouts/          # Layout components
│   ├── services/         # API services and hooks
│   ├── stores/           # Zustand stores
│   ├── theme/            # Chakra UI theme configuration
│   ├── hooks/            # Custom React hooks
│   └── App.tsx           # Main application component
├── public/               # Static assets
├── .storybook/           # Storybook configuration
└── package.json
```

## Development Guidelines

### Component Structure

- Use functional components with TypeScript
- Prefer composition over inheritance
- Keep components small and focused
- Use custom hooks for reusable logic

### Styling

- Use Chakra UI components and props for styling
- Prefer Chakra UI tokens over hardcoded values
- Use `Box` for custom layouts when needed
- Maintain consistent spacing using Chakra UI spacing scale

### State Management

- Use TanStack Query for server state
- Use Zustand for global client state
- Use React state for local component state
- Avoid prop drilling; use context or Zustand when needed

### API Integration

- API client configured in `src/services/api/client.ts`
- Custom hooks in `src/services/api/hooks.ts`
- Query keys centralized in `src/services/api/queryKeys.ts`
- Type definitions in `src/services/api/types.ts`

## Testing

- Unit tests with Vitest and Testing Library
- Component tests in `*.test.tsx` files
- Storybook for component documentation and visual testing

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Troubleshooting

### Common Issues

1. **Module resolution errors**: Ensure `verbatimModuleSyntax: true` uses `import type` for type-only imports
2. **Chakra UI component errors**: Check if component is deprecated in v3 and use alternatives
3. **Type errors**: Verify TypeScript configuration and ensure all types are properly imported

For more details, see `CHANGELOG_FIXES.md` for migration notes and fixes.
