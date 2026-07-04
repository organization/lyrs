import type { JSX } from 'solid-js/jsx-runtime';

/**
 * Keyboard activation handler for clickable non-button elements:
 * triggers the element's click action on Enter / Space.
 */
export const clickOnKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (
  event,
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
};
