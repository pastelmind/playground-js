# Zustand Stable Selector Test

In Zustand, are stable/memoized selectors more performant than
unstable/un-memoized selectors? [The creator says yes.](https://github.com/pmndrs/zustand/discussions/387#discussioncomment-722829) But by how much?

It turns out, when I use a stable (memoized) selector, Zustand will invoke it only if the store's state has changed.

- If the store's state changes, stable selectors are invoked only once to check whether to re-render the component. However, unstable selectors are invoked twice--once to check whether to re-render, then once during the actual render.
- If the component re-renders for some other reason (i.e. the store's state did not change), then stable selectors are not invoked at all. Unstable selectors, on the other hand, are invoked once during the render.
