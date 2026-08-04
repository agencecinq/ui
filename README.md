# CINQ UI Monorepo

Welcome to the **CINQ UI** monorepo. This repository is managed as a monorepo using **pnpm**, **Turborepo**, and **Changesets**.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v22 or higher)
- **pnpm** (v10 or higher)

---

## Setup & Installation

1. **Clone the repository**:

```bash
git clone https://github.com/agencecinq/ui.git
cd ui

```

2. **Install dependencies**:

```bash
pnpm install

```

_Note: Do not use `npm install` or `yarn install`. This project relies on pnpm workspaces._

---

## Daily Workflow

### Development

To start the development server for all packages and apps:

```bash
pnpm dev

```

Turbo will intelligently run all dev scripts. Thanks to our configuration, local changes in `@agencecinq/utils` will be reflected in every consuming package (`drawer`, `modal`, `tabs`, `spinbutton`, `disclosure-button`, `switch`, `accordion`, `combobox`, `windowsplitter`, `calendar`) automatically.

### Building

To compile all packages:

```bash
pnpm build

```

Turbo caches successful builds. If no code has changed, the build will finish in milliseconds.

### Type Checking & Linting

```bash
pnpm typecheck
pnpm lint
```

---

## Publishing New Versions

We use **Changesets** to manage versioning and NPM releases. Never manually update `package.json` version numbers.

### 1. Create a Change File

When your feature or fix is ready, run:

```bash
pnpm change
```

- Select the packages that were modified (e.g., `drawer`).
- Choose the version bump (Patch for fixes, Minor for features).
- Write a brief description of the change.

### 2. Versioning

Before releasing, generate the changelogs and update versions:

```bash
pnpm version-packages
```

### 3. Release to NPM

To build and publish the packages to the `@agencecinq` scope:

```bash
pnpm release
```

---

## Project Structure

- `packages/utils`: Shared logic, event bus, and helpers (`EVENTS`, `clamp`, `throttle`, `focus`, …).
- `packages/drawer`: The Drawer Web Component and its Vite Plugin.
- `packages/modal`: The Modal Web Components (Modal + ModalButton).
- `packages/tabs`: The Tabs Web Component (`<cinq-tabs>`) and related utilities.
- `packages/spinbutton`: The Spinbutton Web Component (`<cinq-spinbutton>`), WAI-ARIA APG-compliant.
- `packages/disclosure-button`: `<cinq-disclosure-button>` Web Component for `aria-expanded` triggers.
- `packages/switch`: `<cinq-switch>` Web Component for binary on/off settings (WAI-ARIA switch pattern).
- `packages/accordion`: `<cinq-accordion>` Web Component for expandable sections (WAI-ARIA accordion pattern).
- `packages/combobox`: `<cinq-combobox>` Web Component for editable list autocomplete (WAI-ARIA combobox pattern).
- `packages/windowsplitter`: `<cinq-windowsplitter>` Web Component for resizable panes (WAI-ARIA window splitter pattern).
- `packages/calendar`: `<cinq-calendar>` Web Component for date / range picking (WAI-ARIA date grid pattern).
- `apps/`: Apps / themes consuming the packages (e.g. `apps/docs`).

---

## Best Practices

1. **Strict ESM**: Always use `import.meta.url` instead of `__dirname` in Node.js scripts (Vite plugins).
2. **Shared Utils**: If you write a utility function that could be used elsewhere, place it in `@agencecinq/utils`.
3. **Peer Dependencies**: When adding a dependency to a package, consider if it should be a `peerDependency` to avoid version conflicts in the final consumer project.
4. **`init` / `destroy` lifecycle** (Web Components): every package host class should expose a public bind/unbind pair (`init` must not call `destroy`) so consumers can tear down and re-bind from outside.

### Host lifecycle: `init` / `destroy`

CINQ UI components mount themselves on connect, but **must** remain controllable from the app:

```ts
class Example extends HTMLElement {
  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  /** Bind DOM + listeners. Does not call `destroy()`. */
  init(): void {
    // query markup, attach listeners, sync ARIA…
  }

  /** Unbind listeners / observers. Safe to call from outside the element. */
  destroy(): void {
    // removeEventListener, disconnect observers, clear controllers…
  }
}
```

| Method | Who calls it | Role |
| ------ | ------------ | ---- |
| `init()` | `connectedCallback`, or the app after a prior `destroy()` | Bind |
| `destroy()` | `disconnectedCallback`, or the app before re-init / DOM mutation | Unbind |

`init()` and `destroy()` stay **separate**: `init()` must not call `destroy()`. When rebinding after a DOM change, the caller always runs both explicitly:

```js
el.destroy();
// mutate light DOM…
el.init();
```

Reference implementations: `@agencecinq/tabs`, `@agencecinq/accordion`, `@agencecinq/spinbutton`, `@agencecinq/calendar`.

---

**Happy coding with CINQ!**
