# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Development Tools

This project includes a comprehensive engineering setup for code quality and consistency:

### Code Quality Scripts

- **`npm run lint`** - Check code for linting errors and style issues
- **`npm run lint:fix`** - Automatically fix auto-fixable linting issues
- **`npm run format`** - Format all code files using Prettier
- **`npm run format:check`** - Check if all files are properly formatted
- **`npm run typecheck`** - Run TypeScript compiler check without emitting files

### Configuration Files

- **`.eslintrc.js`** - ESLint configuration with TypeScript and React Native rules
- **`.prettierrc`** - Prettier formatting rules
- **`.prettierignore`** - Files to exclude from Prettier formatting
- **`.editorconfig`** - Editor configuration for consistent coding style
- **`tsconfig.json`** - TypeScript configuration with strict mode enabled
- **`tailwind.config.js`** - Tailwind CSS configuration for NativeWind
- **`babel.config.js`** - Babel configuration with NativeWind plugin
- **`global.css`** - Tailwind CSS base styles

### Code Quality Rules

- **TypeScript**: Strict mode enabled with `isolatedModules: true`
- **ESLint**: React Native specific rules, TypeScript support, and Prettier integration
- **Prettier**: Consistent code formatting across the project
- **EditorConfig**: Consistent indentation and line endings

### Tech Stack

- **Expo Router**: File-based routing for React Native
- **NativeWind**: Tailwind CSS for React Native
- **TypeScript**: Full type safety throughout the application
- **React Native**: Cross-platform mobile development

### Project Structure

- **`/app`** - Expo Router screens and navigation
  - **`/(tabs)`** - Tab-based navigation (Home, Add, Analytics, Settings)
  - **`_layout.tsx`** - Root layout configuration
- **`/components/ui`** - Reusable UI components
  - **`Text.tsx`** - Themed text component with variants
  - **`Button.tsx`** - Themed button component with variants
- **`/global.css`** - Tailwind CSS base styles for NativeWind

### Best Practices

- All components use TypeScript with proper type annotations
- React Native specific linting rules prevent common issues
- Consistent code formatting ensures readability
- Strict TypeScript configuration catches potential errors early
- NativeWind classes for styling (no inline styles)
- Dark/light theme support with CSS classes

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
