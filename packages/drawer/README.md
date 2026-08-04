# @agencecinq/drawer

A high-performance, accessible, and lightweight Web Component for creating Drawers (off-canvas sidebars) in Shopify themes. Part of the **CINQ** internal tools ecosystem.

## Features

* **Zero Dependencies**: Ultra-light footprint optimized for Shopify themes performance.
* **Accessibility First**: Built-in focus trapping, keyboard navigation (ESC key), and ARIA support.
* **Vite Integration**: Dedicated Vite plugin to automatically sync Liquid snippets with your Shopify theme's `snippets/` folder.
* **Event-Driven**: Fully controllable via the shared `@agencecinq/utils` event system.

---

## Installation

```bash
pnpm add @agencecinq/drawer
```

---

## Usage (Shopify Integration)

### 1. Register the Vite Plugin

In your Shopify project's `vite.config.ts`, add the CINQ Drawer plugin. This will automatically copy the `cinq-drawer.html.liquid` snippet to your theme during development and build.

```typescript
import { defineConfig } from 'vite';
import { cinqDrawerPlugin } from '@agencecinq/drawer/plugin';

export default defineConfig({
  plugins: [
    cinqDrawerPlugin()
  ]
});
```

### 2. Import the Component

In your main JavaScript entry point (e.g. `theme.ts` or `main.js`):

```javascript
import '@agencecinq/drawer';
```

### 3. Implementation in Liquid

Once the plugin has copied the snippet, you can render it in your layout or sections:

```liquid
{% render 'cinq-drawer.html',
   id: 'cart-drawer',
   content: '<p>Your cart is empty.</p>'
%}

<cinq-drawer-button>
  <button aria-controls="cart-drawer" aria-expanded="false">
    View Cart
  </button>
</cinq-drawer-button>
```

---

## API Reference

### Attributes

| Attribute | Description                                                 | Required |
| --------- | ----------------------------------------------------------- | -------- |
| `id`      | Unique identifier for the drawer instance.                  | Yes      |
| `open`    | Reflects the current state. Can be used for styling in CSS. | No       |

### Methods

```javascript
const $drawer = document.querySelector('cinq-drawer#cart-drawer');

$drawer.open();
$drawer.close();
$drawer.toggle({ trigger: null, trap: null });
$drawer.destroy(); // unbind
$drawer.init(); // re-bind
```

When you mutate the drawer DOM at runtime, re-bind with `destroy()` → mutate → `init()`.

### Events

Use constants from `@agencecinq/utils` (`EVENTS.DRAWER_*`). Events are dispatched on `document.documentElement`.

| Event | Constant | Detail | Description |
| ----- | -------- | ------ | ----------- |
| `drawer-toggle` | `DRAWER_TOGGLE` | `{ drawer, trigger, trap }` | Request open/close from a button |
| `drawer-open` | `DRAWER_OPEN` | `{ drawer, trigger? }` | Drawer opened (also closes other open drawers) |
| `drawer-close` | `DRAWER_CLOSE` | `{ drawer }` | Drawer closed |

```js
import { EVENTS } from '@agencecinq/utils';

document.documentElement.addEventListener(EVENTS.DRAWER_OPEN, (event) => {
  console.log(event.detail.drawer);
});
```

---

## Development (Monorepo)

If you are working inside the CINQ monorepo:

1. **Build the package**:
```bash
pnpm build
```

2. **Add a version change**:
```bash
pnpm change
```

3. **Publish to NPM**:
```bash
pnpm release
```

## License

Internal tool developed by **CINQ**. All rights reserved.
