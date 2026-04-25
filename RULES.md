# NewsAI UI Rules

## Purpose

This file defines the product UI direction and implementation rules for the NewsAI app.

## Core Stack

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI primitives: shadcn/ui components only
- Icons: `lucide-react`

## UI Library Rules

- Use shadcn/ui for all UI building blocks.
- Reuse components from `components/ui` before creating anything new.
- If a new primitive is needed, add it in `components/ui` using the shadcn style already established in the repo.
- Use Tailwind utility classes for page composition and visual polish.
- Use Radix primitives only through shadcn-style wrappers.

## Do Not Use

- Do not add Material UI.
- Do not add Chakra UI.
- Do not add Ant Design.
- Do not add Mantine.
- Do not add Bootstrap.
- Do not mix in a second component library.

## Product UI Direction

- The app should feel editorial, modern, and premium.
- Headlines should feel expressive and article-led.
- Body copy should remain highly readable on mobile and desktop.
- Visual design should support long-form reading, not dashboard clutter.
- Interfaces should emphasize calm, trust, and accessibility over flashy novelty.

## Visual System

- Use the color tokens defined in `app/globals.css` and `tailwind.config.ts`.
- Prefer warm neutrals, earthy accents, and strong contrast for reading surfaces.
- Keep cards rounded and soft, consistent with the existing layout.
- Use serif typography for key editorial headlines and sans-serif for interface/body text.
- Maintain generous spacing and avoid cramped layouts.

## Layout Rules

- Build mobile-first, then enhance for tablet and desktop.
- Keep primary content within a centered max-width container.
- Article pages should prioritize reading flow before secondary tools.
- Side panels and feature cards must collapse cleanly on smaller screens.
- Avoid deeply nested layouts when a flatter structure is enough.

## Feature Rules

Every core article experience should be designed to support:

- Original article reading
- Translation into multiple languages, including local languages
- AI-generated summary views
- Reader Q&A grounded in the article
- Audio narration or listening mode

These features can be mocked in the UI for now, but the layout should treat them as first-class product capabilities.

## Component Rules

- Prefer server components by default.
- Use client components only when interaction requires them.
- Keep display content separate from reusable UI primitives.
- Put shared helpers in `lib`.
- Keep component APIs small and predictable.
- Extend existing variants before creating one-off component patterns.

## Accessibility Rules

- All interactive elements must have clear labels.
- Color alone must not communicate state.
- Maintain visible focus states.
- Ensure sufficient contrast for text and controls.
- Use semantic headings and landmarks.
- Tabs, accordions, and audio controls must remain keyboard-usable.

## Content Rules

- Demo content should feel like a real article, not placeholder filler.
- Examples should showcase the app's multilingual and AI-native direction.
- Keep summaries concise and scannable.
- Q&A examples should answer real reader questions about the article.
- Audio UI should communicate progress, state, and listening context.

## Code Rules

- Keep the codebase TypeScript-first.
- Follow strict typing and avoid unnecessary `any`.
- Keep styles close to components unless they belong in global tokens.
- Prefer composition over duplication.
- Do not add mock features that look interactive unless the state is represented clearly.

## Default Build Rule

When adding new screens or features, the implementation should match these rules unless this file is intentionally updated.
