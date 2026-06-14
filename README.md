# Localize-It

A lightweight, type-safe internationalization (i18n) library for React applications with TypeScript support.

## Features

- **Type-Safe**: Full TypeScript support with strict type inference for localization parameters
- **React Integration**: Built-in React Context API support with hooks
- **Simple API**: Minimal learning curve with a straightforward API
- **Language Support**: Multi-language support with extensible language enum
- **Dynamic Content**: Support for template-based localization with dynamic parameters
- **Browser Language Detection**: Automatic fallback to browser language preferences

## Installation

```bash
npm install localize-it
```

## Quick Start

### 1. Setup Provider

Wrap your application with `LocalizationProvider`:

```tsx
import { LocalizationProvider, ELanguages } from 'localize-it';
import App from './App';

export default function Root() {
  return (
    <LocalizationProvider initialLanguage={ELanguages.en}>
      <App />
    </LocalizationProvider>
  );
}
```

### 2. Define Localization Objects

Create your localization descriptions:

```typescript
import { ELanguages } from 'localize-it';

export const welcomeMessage = {
  [ELanguages.en]: 'Welcome to our app',
  [ELanguages.ru]: 'Добро пожаловать в наше приложение',
};

export const greeting = {
  [ELanguages.en]: (data: { name: string }) => `Hello, ${data.name}!`,
  [ELanguages.ru]: (data: { name: string }) => `Привет, ${data.name}!`,
};
```

### 3. Use in Components

```tsx
import { useLocalization } from 'localize-it';
import { welcomeMessage, greeting } from './localization';

export function MyComponent() {
  const localization = useLocalization();

  return (
    <div>
      <h1>{localization.getLocalized(welcomeMessage)}</h1>
      <p>
        {localization.getLocalized(greeting, {
          templateData: { name: 'John' },
        })}
      </p>
    </div>
  );
}
```

## API Reference

### `LocalizationProvider`

Context provider component that makes localization available to child components.

**Props:**
- `initialLanguage: ELanguages` - The initial language for the application
- `children: ReactNode` - Child components

### `useLocalization()`

Hook to access the localization instance within components wrapped by `LocalizationProvider`.

**Returns:** `Localization` instance

**Throws:** `Error` if used outside `LocalizationProvider`

### `Localization` Class

Main class for handling localization logic.

#### Constructor

```typescript
new Localization({ language: ELanguages.en })
```

#### Methods

##### `getLanguage(): ELanguages`

Returns the currently active language. Falls back to browser language if not explicitly set.

##### `getBrowserLanguage(): ELanguages`

Detects and returns the browser's language preference (first two characters converted to lowercase).

##### `getLocalized<L, P>(loc: L, props?: P): string`

Retrieves localized content with optional parameters.

**Generic Parameters:**
- `L` - Localization description type
- `P` - Extracted parameter type (automatically inferred)

**Parameters:**
- `loc: L` - Localization object
- `props?: P` - Optional parameters including:
  - `lang?: ELanguages` - Override language for this lookup
  - `templateData?: any` - Data for template-based localization

**Returns:** Localized string

**Throws:** `LocalizationError` if:
- Localization object is not provided
- Unsupported language is requested
- Template parameters are missing for functional localization

### `ELanguages` Enum

Supported languages:
- `en` - English
- `ru` - Russian

Extend by modifying the enum in `src/types.ts`.

## Type Safety

The library uses TypeScript's advanced type system to ensure type safety:

```typescript
// This is type-safe - TypeScript knows greeting requires templateData
const text = localization.getLocalized(greeting, {
  templateData: { name: 'Alice' }, // Required and typed
});

// This is type-safe - TypeScript knows welcomeMessage doesn't require templateData
const text2 = localization.getLocalized(welcomeMessage);
```

## Error Handling

The library throws `LocalizationError` for common issues:

```typescript
import { Localization, LocalizationError } from 'localize-it';

try {
  localization.getLocalized(null);
} catch (error) {
  if (error instanceof LocalizationError) {
    console.error('Localization error:', error.message);
  }
}
```

## Examples

### Simple String Localization

```typescript
const pageTitle = {
  en: 'Home',
  ru: 'Главная',
};

const title = localization.getLocalized(pageTitle);
```

### Template-Based Localization

```typescript
const userProfile = {
  en: (data: { username: string; age: number }) =>
    `${data.username} is ${data.age} years old`,
  ru: (data: { username: string; age: number }) =>
    `${data.username} имеет возраст ${data.age} лет`,
};

const profile = localization.getLocalized(userProfile, {
  templateData: { username: 'John', age: 25 },
});
```

### Language Override

```typescript
// Get localized text in a specific language
const russianText = localization.getLocalized(welcomeMessage, {
  lang: ELanguages.ru,
});
```

## Roadmap

### Planned Features

#### v4.0.0: Config-Driven Language Support

The next major version will introduce a powerful configuration-based approach to language management:

**Concept:**
Define supported languages in your root configuration file, and the library will automatically handle typing and validation based on your config.

**Implementation Plan:**

1. **Config File Support**
   - Create a localization config file (e.g., `localize-it.config.ts`) in your project root
   - Define supported languages as a TypeScript type or constant array
   - Example:
   ```typescript
   // localize-it.config.ts
   export const supportedLanguages = ['en', 'ru', 'de', 'fr'] as const;
   export type AppLanguage = typeof supportedLanguages[number];
   ```

2. **Dynamic Type Generation**
   - Languages defined in config will automatically update the library's type system
   - No need to modify the `ELanguages` enum for every new language
   - TypeScript will infer available languages at compile time

3. **Configuration Pass-Through**
   - Pass config languages to `LocalizationProvider`:
   ```tsx
   import { LocalizationProvider } from 'localize-it';
   import { supportedLanguages } from './localize-it.config';

   export default function Root() {
     return (
       <LocalizationProvider 
         initialLanguage="en"
         supportedLanguages={supportedLanguages}
       >
         <App />
       </LocalizationProvider>
     );
   }
   ```

4. **Type-Safe Localization Objects**
   - Localization objects will be strictly typed based on config languages
   - TypeScript will enforce that all configured languages are present:
   ```typescript
   const greeting = {
     en: 'Hello',
     ru: 'Привет',
     de: 'Hallo',
     fr: 'Bonjour',
     // TypeScript error if any configured language is missing
   };
   ```

5. **Language Override Typing**
   - `lang` parameter in `getLocalized()` will only accept configured languages:
   ```typescript
   localization.getLocalized(greeting, {
     lang: 'es', // TypeScript error - 'es' not in config
   });
   ```

**Benefits:**
- Eliminate hardcoded language enums
- Add new languages without code changes
- Full type safety for dynamic language support
- Seamless integration with existing code patterns

**Status:** In planning phase

## Development

### Prerequisites

- Node.js 16+
- TypeScript 6.0+

### Build

```bash
npm run build
```

Outputs compiled files to the `dist` directory.

### Scripts

- `npm run build` - Compile TypeScript to JavaScript

## License

ISC

## Repository

[GitHub - localaze-it](https://github.com/ktoYaTako/localaze-it)

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
