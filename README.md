# ambira-mobile
Ambira is a social media application on which users can track and share their productivity with others. You can follow your friends and your inspirations, and build an online community that is there to motivate and encourage accountability. Users can select from a wide array of productivity activities, from reading to studying to cooking, and monitor how long they spend with each activity. After completing an activity, users can add a caption, attach photos, and post their activity! However, the user’s involvement in the communal aspect of Ambira is completely customizable with privacy flairs for each post. Users can choose to share their activities with everyone, just their followers, or keep them private for only them to see. Ambira redefines social media by inspiring focus, accountability, and motivation, helping users celebrate progress, not just presence.

## Project structure

The repository contains the Expo mobile app, organised for long-term scaling.

```
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
```

TypeScript is configured with a `@/` path alias that points to `src/`, enabling imports such as `import { HomeScreen } from '@/screens/HomeScreen'`.

## Local development

Expo Go does not support the full functionality of Ambira, so you will initialize a development build for local testing.

### Development builds (EAS dev client)

For work that depends on native changes, use the EAS `development` profile (see `eas.json`) to build a dev client per platform:

```
npx eas build --profile development --platform ios      # simulator .app
npx expo start --dev-client                              # start bundler for the dev client
```

Install the built artifact on your simulator/emulator, then launch the installed dev client to load the app.

### Available scripts
