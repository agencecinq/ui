import { Store } from '@agencecinq/store';

export type Item = { key: string; label: string; price: number };

export type Party = { gold: number; backpack: Item[] };

export const SHOP: Item[] = [
  { key: 'potion', label: 'Potion of healing', price: 50 },
  { key: 'rope', label: 'Hempen rope', price: 5 },
  { key: 'shield', label: 'Shield +1', price: 150 },
];

export const BACKPACK_SIZE = 4;

/**
 * One store for the whole page. Every widget imports it, none knows the others.
 * The rules live here: whoever writes, the purse never goes negative and the
 * backpack never holds more than four items.
 */
class PartyStore extends Store<Party> {
  constructor() {
    super(
      { gold: 60, backpack: [] },
      {
        normalize: (next, previous) =>
          next.gold < 0 || next.backpack.length > BACKPACK_SIZE ? previous : next,
      },
    );
  }

  buy(item: Item): void {
    this.set((party) => ({
      gold: party.gold - item.price,
      backpack: [...party.backpack, item],
    }));
  }

  sell(index: number): void {
    this.set((party) => ({
      gold: party.gold + Math.floor(party.backpack[index].price / 2),
      backpack: party.backpack.filter((_, position) => position !== index),
    }));
  }

  /**
   * A server call stands in for the dungeon: loots settle in order. The
   * function applies to the party current once the loot settles, so a
   * purchase made meanwhile is kept.
   */
  loot(): Promise<Party> {
    return this.mutate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const gold = 10 + Math.floor(Math.random() * 40);

      return (party) => ({ ...party, gold: party.gold + gold });
    });
  }
}

export const party = new PartyStore();
