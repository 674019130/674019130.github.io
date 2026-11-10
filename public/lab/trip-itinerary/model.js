// Layout model for the itinerary card deck.
// The deck is cyclic: ORDER lists the cards top-to-bottom, and the list wraps,
// so the card after the bottom one is the top card again (as in the reference
// video, where the trip photo peeks both above Budget and below Flight).

export const ORDER = ['trip', 'budget', 'dining', 'stays', 'route', 'flight'];
export const N = ORDER.length;

export const APP_H = 640;
export const COLLAPSED = 62;
export const GAP = 8;

// Expanded (focused) height per card. Content is sized to fit.
export const HEIGHTS = {
  trip: 326,
  budget: 360,
  dining: 384,
  stays: 344,
  route: 392,
  flight: 288,
};

// Signed distance from focus in the cycle, in (-N/2, N/2].
// Positive d renders below the focused card, negative above.
export function offset(index, focus) {
  let d = (index - focus) % N;
  if (d > N / 2) d -= N;
  if (d <= -N / 2) d += N;
  return d;
}

// Top edge (px) of card `index` inside the app when `focus` is centered.
export function cardTop(index, focus, appH = APP_H) {
  const d = offset(index, focus);
  const top0 = (appH - HEIGHTS[ORDER[focus]]) / 2;
  if (d === 0) return top0;
  if (d < 0) return top0 - GAP - COLLAPSED - (-d - 1) * (COLLAPSED + GAP);
  return top0 + HEIGHTS[ORDER[focus]] + GAP + (d - 1) * (COLLAPSED + GAP);
}

// Move the focus. dir = -1 walks up the stack (the video's direction:
// flight -> route -> stays -> dining -> budget -> trip -> flight),
// dir = +1 walks down.
export function step(focus, dir) {
  return (focus + dir + N) % N;
}

// Index of the closest card in `dir` direction: -1 = the card above,
// +1 = the card below.
export function neighbor(focus, dir) {
  return step(focus, dir < 0 ? -1 : 1);
}

export function isExpanded(index, focus) {
  return offset(index, focus) === 0;
}
