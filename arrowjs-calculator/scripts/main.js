import { html, reactive } from "./arrow.js";

const store = reactive({
  formula: "",
});

const handleNumberClick = (num) => () => {
  store.formula = store.formula ? `${store.formula} ${num}` : String(num);
};

const handleActionClick = (action) => () => {
  if (action === "C") {
    store.formula = "";
  } else {
    store.formula = store.formula ? `${store.formula} ${action}` : action;
  }
};

const numberButton = (num) => html`
  <button
    type="button"
    class="calculator-button calculator-number-button"
    @click="${handleNumberClick(num)}"
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
    <output class="calculator-display__result"></output>
    <output class="calculator-display__formula">${() => store.formula}</output>
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
