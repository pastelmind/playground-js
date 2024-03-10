/**
 * @param {number} intervalMs
 * @param {number} transitionMs
 * @param {number} itemCount
 * @returns {Keyframe[]}
 */
function createKeyframes(intervalMs, transitionMs, itemCount) {
  return [
    // Initial
    {
      offset: 0,
      opacity: 1,
      zIndex: 0,
      easing: "step-end",
    },
    // Begin fade-out
    {
      offset: 1 / itemCount,
      opacity: 1,
      zIndex: 1, // During fade-out, draw this image over the next one
    },
    // Finish fade-out
    {
      offset: (1 + transitionMs / intervalMs) / itemCount,
      opacity: 0,
      zIndex: 1,
    },
    // Add explicit 'to' keyframe because Safari 14 has bugs with implicit
    // keyframes.
    // See: https://caniuse.com/mdn-api_element_animate_implicit_tofrom
    {
      offset: 1,
      opacity: 0,
    },
  ];
}

/**
 * @param {Element} figure
 * @param {number} intervalMs
 * @param {number} transitionMs
 * @returns {void}
 */
function animateFigure(figure, intervalMs, transitionMs) {
  const keyframes = createKeyframes(
    intervalMs,
    transitionMs,
    figure.children.length
  );
  for (let i = 0; i < figure.children.length; ++i) {
    figure.children[i].animate(keyframes, {
      duration: intervalMs * figure.children.length,
      delay: intervalMs * i,
      iterations: Infinity,
    });
  }
}

const INTERVAL_MS = 2000;
const TRANSITION_MS = 500;

const figure = document.querySelector("figure");
if (!(figure instanceof HTMLElement)) {
  throw new Error("Cannot find figure");
}

animateFigure(figure, INTERVAL_MS, TRANSITION_MS);

export {};
