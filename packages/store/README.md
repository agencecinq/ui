[![](https://img.shields.io/npm/v/@agencecinq/store)](https://www.npmjs.com/package/@agencecinq/store)
[![](https://img.shields.io/npm/dm/@agencecinq/store)](https://www.npmjs.com/package/@agencecinq/store)

# @agencecinq/store

> Tiny observable state store: normalized updates, selectors and a queue for async actions.

A store holds one state that several components read and update: a cart, a
configurator, a filter panel. `Store` keeps it immutable, normalizes every change,
notifies listeners synchronously, and queues async actions such as server calls so
they settle in order. No dependency, no framework, about 0.6 kB gzipped.

## Installation

```bash
pnpm add @agencecinq/store
```

## Usage

```js
import { Store } from "@agencecinq/store";

const party = new Store(
  { gold: 10, members: ["Mialee"] },
  {
    // Every next state goes through it, a negative purse becomes empty.
    normalize: (next) => ({ ...next, gold: Math.max(0, next.gold) }),
  },
);

party.select(
  (state) => state.gold,
  (gold) => {
    document.querySelector("[data-gold]").textContent = gold;
  },
);

party.set((state) => ({ ...state, gold: state.gold - 25 }));
```

Extend it for a domain store, one instance per page:

```ts
import { Store } from "@agencecinq/store";

class CartStore extends Store<Cart> {
  add(items: CartItem[]): Promise<Cart> {
    return this.mutate(async () => {
      await addCartItems(items);
      return fetchCart();
    });
  }
}

export default new CartStore(window.cart);
```

## API

`new Store(initial, options?)`. The initial state is taken as is: normalize it first
when it needs to be.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `normalize` | `(next, previous) => T` | identity | Applied to every next state before the comparison. |
| `equals` | `(a, b) => boolean` | `Object.is` | Equal states skip the notification. Pass a deep comparison when `normalize` always builds new objects. |

| Method / property | Description |
| ----------------- | ----------- |
| `get()` | Current state. |
| `set(update)` | A value, or a function of the current state. Normalized, compared, then listeners run synchronously. |
| `subscribe(listener)` | `listener(state, previous)` on every change, not right away. Returns the unsubscribe function. |
| `select(selector, listener, equals?)` | `listener(slice)` right away, then when the slice changes. Returns the unsubscribe function. |
| `mutate(action)` | Runs `action(state)` after the queued ones and sets the state it resolves to. Returns the new state. A rejected action leaves the state as is and does not block the queue. |
| `pending` | Whether queued actions are running. |
| `subscribePending(listener)` | `listener(pending)` right away, then when the queue starts or settles. Returns the unsubscribe function. |

A listener that throws is reported with `reportError()` and does not stop the others.

## Patterns

- **Server answers.** Return the merged state from `mutate`, the queue applies it
  once every earlier action has settled.
- **Busy UI.** Bind `aria-busy` or a spinner to `subscribePending`.
- **Rules.** Put catalog constraints in `normalize`: every component then reads a
  valid state, whatever wrote it.

## Build setup

```bash
pnpm -C packages/store build
pnpm -C packages/store test
```

See the [interactive docs](https://agencecinq.github.io/ui/reference/store/) for a live example.
