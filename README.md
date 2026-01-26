# CINQ Monorepo - Shopify Components

A high-performance, accessible, and scalable component library specifically designed for Shopify themes. Built with **Native Web Components**, **Turborepo**, and **Vite**.

## Project Structure

- `apps/docs`: Development playground and documentation site.
- `packages/c-drawer`: Highly accessible Drawer (Sidebar) component.
- `packages/utils`: Shared internal logic (Focus trapping, scroll management, event bus).

## Getting Started

### Installation
```bash
yarn install
```

### Development
Launch all packages and the documentation playground in parallel:

```bash
yarn dev
```

### Build
Compile all packages and sync Liquid snippets:

```bash
yarn build
```

## Component: Drawer
The Drawer is a native custom element (<cinq-drawer>) that manages its own state, visibility, and accessibility requirements.

## Integration in Shopify (Liquid)
The build process automatically syncs the cinq-drawer.liquid snippet to your theme.

```
{% render 'cinq-drawer', id: 'cart-drawer' %}
```

## Control Buttons

Use the <cinq-drawer-button> wrapper to create triggers. It automatically handles aria-expanded and communicates with the target drawer using aria-controls.

```html
<cinq-drawer-button>
  <button 
    type="button" 
    aria-controls="cart-drawer" 
    data-trap="cart-drawer"
  >
    Open Cart
  </button>
</cinq-drawer-button>
```
## CINQ Core Principles

Native over Frameworks: We use vanilla Web Components to ensure longevity and zero-dependency bloat in Shopify themes.

Bulletproof Accessibility: Focus trapping (addTrapFocus) and Scroll Locking are mandatory for all modal-like components.

Event-Driven Architecture: Components communicate via a global event bus (document.documentElement), allowing for deep nesting and external control.

Tooling Efficiency: Turborepo ensures that we only rebuild what has changed, keeping the CI/CD pipeline fast.

© 2026 CINQ Agency. Confidential and Proprietary.


---

### Implementation Note for the Agency
This README serves as the "Source of Truth" for your developers. It clearly outlines how the **CINQ** philosophy is translated into code.