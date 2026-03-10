export const EVENTS = {
  DRAWER_CLOSE: 'drawer-close',
  DRAWER_OPEN: 'drawer-open',
  DRAWER_TOGGLE: 'drawer-toggle',
  MODAL_CLOSE: 'modal-close',
  MODAL_OPEN: 'modal-open',
  MODAL_TOGGLE: 'modal-toggle',
  CART_UPDATE: 'cart-update',
  VARIANT_CHANGE: 'variant-change',
};

export type EventNames = typeof EVENTS[keyof typeof EVENTS];