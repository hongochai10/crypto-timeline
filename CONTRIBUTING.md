# Contributing to Crypto Timeline

Thank you for your interest in contributing! This guide covers the conventions and standards used in this project.

## Development Setup

```bash
git clone <repository-url>
cd crypto-timeline-project
npm install
npm run dev
```

Verify your setup by running the test suite:

```bash
npm test
```

## Project Structure

```
src/
  app/          # Next.js App Router (layout, page, global styles)
  components/
    stations/   # One component per crypto era
    demos/      # Interactive encryption/decryption playgrounds
    attacks/    # Attack simulation components
    ui/         # Shared UI components
  lib/
    constants.ts
    crypto/     # Algorithm implementations + tests
  e2e/          # Playwright end-to-end tests
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode. All code must pass `tsc --noEmit` without errors.
- Prefer `interface` for object shapes, `type` for unions and intersections.
- Avoid `any`. Use `unknown` and narrow with type guards when the type is genuinely unknown.
- Export types alongside their implementations -- no separate `types.ts` barrel files.

### React Components

- Use function components with hooks. No class components.
- One component per file. File name matches the component name (`CaesarDemo.tsx` exports `CaesarDemo`).
- Keep components focused. If a component exceeds ~200 lines, consider splitting it.
- Use Framer Motion for animations (already a project dependency).

### Styling

- Use **Tailwind CSS** utility classes. No inline `style` props unless dynamically computed.
- Era-specific colors are defined as CSS custom properties in `globals.css` and as Tailwind tokens in `tailwind.config.ts`. Use the tokens (e.g., `bg-caesar-bg`, `text-aes-accent`) rather than raw hex values.
- Responsive design: mobile-first. Test at 375px and 1440px widths.

### Crypto Implementations

- **Browser-only.** All crypto code must run in the browser. Use the Web Crypto API (`window.crypto.subtle`) for production-grade algorithms (AES, RSA, ECC).
- **Educational implementations** (Caesar, DES, toy LWE) are pure JavaScript -- no external crypto libraries.
- Every crypto module must include a comment header stating whether it is educational or production-grade.
- Add unit tests for every public function in the corresponding `*.test.ts` file.

### Testing

**Unit tests** (Vitest):
- Co-locate test files with source: `caesar.ts` + `caesar.test.ts`.
- Test both happy paths and edge cases (empty input, invalid keys, boundary values).
- For Web Crypto API tests, use the `jsdom` environment (configured in `vitest.config.ts`).

**E2E tests** (Playwright):
- Located in `src/e2e/`.
- Test user-visible behavior: scrolling to a station, entering text, seeing encrypted output.
- Use accessible selectors (`getByRole`, `getByLabel`, `data-testid`) over CSS selectors.

Run tests before submitting:

```bash
npm test                  # Unit tests
npx playwright test       # E2E tests
npm run lint              # ESLint
```

## Adding a New Crypto Station

To add a 7th station (e.g., a new NIST standard):

1. **Crypto library** -- Create `src/lib/crypto/newAlgo.ts` with encrypt/decrypt functions and a `*.test.ts` file.
2. **Station component** -- Create `src/components/stations/NewAlgoStation.tsx` with historical narrative, key figures, and timeline events.
3. **Demo component** -- Create `src/components/demos/NewAlgoDemo.tsx` with interactive encryption/decryption.
4. **Attack component** -- Create `src/components/attacks/NewAlgoAttack.tsx` showing the algorithm's vulnerabilities (or quantum resistance).
5. **Era definition** -- Add the new era to the `ERAS` array in `src/lib/constants.ts` with its color palette, year, and status.
6. **Tailwind tokens** -- Add the era's color palette to `tailwind.config.ts` and `globals.css`.
7. **Tests** -- Add unit tests for the crypto module and update E2E tests to cover the new station.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(TEC-123): add ECDH key agreement demo
fix(TEC-456): correct DES S-box permutation table
docs: update README with ECC station details
test: add RSA factorization edge case tests
refactor: extract shared Station layout component
```

- Prefix with the ticket identifier when one exists (e.g., `TEC-123`).
- Keep the subject line under 72 characters.
- Use the body for details when the subject line is not sufficient.

## Pull Requests

- One feature or fix per PR.
- Include a description of what changed and why.
- Ensure all tests pass (`npm test` and `npx playwright test`).
- Ensure the build succeeds (`npm run build`).
- Request review from a maintainer.

## Security

- **Never commit secrets** (API keys, private keys, `.env` files).
- **Never introduce real cryptographic dependencies** for the educational implementations. The point is to show how the algorithms work, not to wrap a library.
- If you find a security issue in the Web Crypto API usage (AES, RSA, ECC), please report it privately rather than opening a public issue.

## Code of Conduct

Be respectful, constructive, and inclusive. This is an educational project -- questions and learning are encouraged.
