**Developer Documentation - Mobile App**


**How to obtain source code:**
Go to https://github.com/AmbiraDev/ambira-mobile and clone it

**Layout of the directory structure:**
app.json            # Expo project configuration
assets/             # Images, fonts, and other static assets
index.ts            # Native entry point that registers the root component
src/
  App.tsx           # App root, wires global providers and navigation
  components/       # Reusable presentation components
  constants/        # App-wide constants (API routes, enums, etc.)
  hooks/            # Shared React hooks
  navigation/       # Navigation containers and route configs
  screens/          # Screen-level UI composed from components
  services/         # API clients, Firebase integrations, analytics
  store/            # Global state (React Context, Zustand, Redux, etc.)
  theme/            # Design tokens (colors, spacing, typography)
  utils/            # Cross-cutting utilities and helpers



**How to build the software:**
npx expo start (starts development server through expo with more options):
“i” to start ios simulator
“a” to start android simulator
“r” to refresh
Scan the QR code to use the Expo app for development

**How to test the software:**
To test the software, run the suite at three layers. For fast logic checks, execute unit tests with Jest (from the repo root) targeting tests/unit, which validates utilities, hooks, and providers using lightweight, deterministic mocks stored in tests/mocks. Next, run integration tests (Jest + Testing Library for web and React Native) from tests/integration to verify state transitions, routing guards, and cross-context behavior with mocked Firebase backends and shared fixtures in tests/fixtures. Finally, validate real user journeys with end-to-end tests: use Playwright for the web app (tests/e2e) and Detox for the mobile app (tests/e2e), preferring role-based selectors or data-testid/testID. For flows that touch backend data, rely on the Firebase Emulator Suite or seeded local data; capture traces, screenshots, and logs on failure to aid debugging. In CI (GitHub Actions), builds run typecheck and lint, execute all unit and integration tests, and then a smoke subset of E2E tests, uploading artifacts so regressions are visible on pull requests.

**How to add new tests**

To add new tests, developers should follow the project’s three-layer testing strategy shared across both web and mobile. **Unit tests**, located in `src/__tests__/unit/`, validate isolated logic such as functions, utilities, or React hooks. **Integration tests**, in `src/__tests__/integration/`, verify interactions across multiple modules or contexts—such as state transitions or Firebase data flow—using Jest together with React or React Native Testing Library. **End-to-End (E2E) tests** are placed in the `e2e/` directory and use Playwright for web or Detox for mobile to simulate complete user journeys in a browser or device environment.

Before writing a new test, choose the correct layer based on scope. Place the file in the corresponding directory and name it descriptively according to the feature under test (for example, `feed/comment-flow.test.ts`). Shared mocks for Firebase, routing, and React Query live in `src/__tests__/helpers/`, and reusable fixtures that mirror real API responses are stored in `src/__tests__/fixtures/`. Developers should favor local, deterministic mocks rather than global automocking and keep each test focused on verifying one primary behavior.

For **web E2E tests**, use `.spec.ts` files with Playwright, organize common helpers under `e2e/pages/`, prefer role-based or `data-testid` selectors, and record traces on failure. For **mobile E2E tests**, ensure interactive elements include `testID` props, rely on Detox’s built-in synchronization instead of manual delays, and run tests using the platform-specific Detox configuration. All tests follow consistent conventions: `.test.ts` for unit and integration, `.spec.ts` for E2E, minimal use of snapshots, and descriptive `describe` and `it` blocks that focus on user-visible behavior (e.g., “starts timer when user clicks start button”).

Developers can reuse shared utilities from `tests/utils/test-helpers.ts`, such as `renderWithProviders()` to mount components with necessary context or `loginTestUser()` to automate authentication flows. To execute tests, use the following commands:

* Unit: `npm run test -- src/__tests__/unit`
* Integration: `npm run test -- src/__tests__/integration`
* Web E2E: `npx playwright test`
* Mobile E2E: `npx detox test`

Finally, Jest is configured to enforce minimum coverage thresholds of 80% across branches, functions, lines, and statements. Developers can generate a detailed coverage report by running `npm run test:coverage`, which outputs results to the `coverage/` directory. Together, these conventions ensure all new tests are structured, consistent, and reliable across the Ambira codebase.

**How to build a release of the software:**
Building a release involves preparing, validating, and deploying a stable production version of the software. Before building, developers should update the version number in `package.json` following Semantic Versioning, refresh documentation such as the `CHANGELOG.md`, and run the full test suite—including linting, type-checking, unit, integration, and end-to-end tests—to ensure the system is stable. If any Firestore security rules have changed, they must be redeployed before creating the production build. The release build is generated using `npm run build`, and developers should perform sanity checks by starting the production server locally to verify that core features (such as login, feed, and timer functionality) work correctly without console errors. Once verified, the updated version and changelog should be committed, tagged (e.g., `v1.2.0`), and pushed to the main branch. Most tasks—such as linting, testing, and deployment—are automated through GitHub Actions, but developers are still responsible for manually updating documentation, bumping the version, and confirming production stability after deployment. Post-release, teams should run smoke tests on production, monitor error tracking tools like Sentry, and validate that Firestore rules and hosting behave as expected. If a major issue arises, developers can roll back to a previous version via Vercel or Firebase and notify the team while preparing a hotfix for re-release.
