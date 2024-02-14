import { html, reactive } from "./arrow.js";

const store = reactive({
  tokens: [],
});

/**
 * Computes the result of evaluating a sequence of formula tokens.
 * Attempts to evaluate the formula, even if it is incomplete. Any trailing
 * tokens that do not complete the formula are ignored.
 * Returns null if the formula is empty.
 * Throws an Error if the formula is malformed.
 */
const computeResult = () => {
  let result = null;
  let prevToken = null;

  for (const token of store.tokens) {
    if (!prevToken) {
      if (token.type !== "number") {
        throw new Error(`First token '${token.str}' is not a number`);
      }
      result = Number(token.str);
    } else {
      if (token.type === "number") {
        const tokenValue = Number(token.str);
        if (!Number.isFinite(tokenValue)) {
          throw new Error(`Invalid number token '${token.str}'`);
        }

        if (prevToken.type !== "operator") {
          throw new Error(
            `Number token '${token.str}' cannot follow token '${prevToken.str}' (type '${prevToken.type}')`
          );
        }

        // Evaluate eagerly, ignoring operator precedence
        if (prevToken.str === "+") {
          result += tokenValue;
        } else if (prevToken.str === "-") {
          result -= tokenValue;
        } else if (prevToken.str === "*") {
          result *= tokenValue;
        } else if (prevToken.str === "/") {
          // Allow division by zero, which can become NaN or Infinity due to
          // JavaScript semantics
          result /= tokenValue;
        } else {
          throw new Error(`Invalid operator token '${prevToken.str}'`);
        }
      } else if (token.type === "operator") {
        if (prevToken.type !== "number") {
          throw new Error(
            `Operator token '${token.str}' cannot follow token '${prevToken.str}'`
          );
        }
        // Do nothing here, other than storing token in prevToken
      } else {
        throw new Error(`Unhandled token type '${token.type}'`);
      }
    }

    prevToken = token;
  }

  return result;
};

const generateFormula = () => store.tokens.map((token) => token.str).join(" ");

const handleDigitOrDotClick = (digitOrDot) => () => {
  const prevToken = store.tokens.at(-1);
  if (prevToken?.type === "number") {
    prevToken.str += String(digitOrDot);
  } else {
    // Either the prevToken is an operator, or there is no prevToken
    store.tokens.push({ type: "number", str: String(digitOrDot) });
  }
};

const handleActionClick = (action) => () => {
  if (action === "C") {
    store.tokens = [];
  } else {
    const prevToken = store.tokens.at(-1);
    if (prevToken?.type === "number") {
      store.tokens.push({ type: "operator", str: action });
    }
    // Ignore operator if prevToken does not exist or is another operator
  }
};

const numberButton = (num) => html`
  <button
    type="button"
    class="calculator-button calculator-number-button"
    @click="${handleDigitOrDotClick(num)}"
  >
    ${num}
  </button>
`;

const actionButton = (action, text) => html`
  <button
    type="button"
    class="calculator-button calculator-action-button"
    @click="${handleActionClick(action)}"
  >
    ${text}
  </button>
`;

const calculator = html`
  <section class="calculator-display">
    <output class="calculator-display__result">${computeResult}</output>
    <output class="calculator-display__formula">${generateFormula}</output>
  </section>
  <div class="calculator-button-menu">
    <!-- row -->
    ${numberButton(7)} ${numberButton(8)} ${numberButton(9)}
    <!-- row -->
    ${numberButton(4)} ${numberButton(5)} ${numberButton(6)}
    <!-- row -->
    ${numberButton(1)} ${numberButton(2)} ${numberButton(3)}
    <!-- row -->
    ${actionButton(".", ".")} ${numberButton(0)} ${actionButton("+", "+")}
    <!-- row -->
    ${actionButton("-", "-")} ${actionButton("/", "&div;")}
    ${actionButton("*", "&times;")}
    <!-- row -->
    ${actionButton("C", "C")}
    <!-- no button -->
    <button
      type="button"
      class="calculator-button calculator-evaluate-button"
      @click="${handleActionClick("=")}"
    >
      =
    </button>
  </div>
`;

const appElement = document.querySelector(".calculator");
calculator(appElement);
