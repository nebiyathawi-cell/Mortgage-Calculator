const mortgeInput = document.querySelector("#mortgage-input");
const termInput = document.querySelector("#term-input");
const rateInput = document.querySelector("#rate-input");
const typeInputs = document.querySelectorAll('input[name="mortgage-type"]');

const emptyState = document.getElementById("empty-state");
const calculationResult = document.getElementById("calculation-result");

const monthlyRepayment = document.getElementById("monthly-repayment");
const totalRepayment = document.getElementById("total-repayment");

const amountError = document.getElementById("amountError");
const rateError = document.getElementById("rateError");
const yearsError = document.getElementById("yearsError");
const typeError = document.getElementById("typeError");

const mortgageForm = document.getElementById("mortgage-form");
const clearBtn = document.getElementById("clear-all");

const gbpFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function setInputError(inputEl, errorEl, message) {
  const wrapper = inputEl.closest("div");
  const unitBadge = wrapper.querySelector("span");

  if (message) {
    errorEl.textContent = message;
    errorEl.className = "text-xs font-medium text-[#d73328] mt-2";

    wrapper.classList.remove("border-[#6b94a8]", "focus-within:border-[#d7da2f]");
    wrapper.classList.add("border-[#d73328]");

    unitBadge.classList.remove("bg-[#e3f4fc]", "text-[#4e6e7e]", "bg-[#d7da2f]", "text-[#122f3f]");
    unitBadge.classList.add("bg-[#d73328]", "text-white");
  } else {
    errorEl.textContent = "";
    errorEl.className = "";

    wrapper.classList.remove("border-[#d73328]");
    wrapper.classList.add("border-[#6b94a8]", "focus-within:border-[#d7da2f]");

    unitBadge.classList.remove("bg-[#d73328]", "text-white", "bg-[#d7da2f]", "text-[#122f3f]");
    unitBadge.classList.add("bg-[#e3f4fc]", "text-[#4e6e7e]");
  }
}

function setTypeError(message) {
  if (message) {
    typeError.textContent = message;
    typeError.className = "text-xs font-medium text-[#d73328] mt-2";
  } else {
    typeError.textContent = "";
    typeError.className = "";
  }
}

function validateInputs() {
  let isValid = true;

  const aRaw = mortgeInput.value.trim();
  const rRaw = rateInput.value.trim();
  const tRaw = termInput.value.trim();
  const selectedType = document.querySelector(
    'input[name="mortgage-type"]:checked'
  );

  const amount = Number(aRaw);
  const rate = Number(rRaw);
  const term = Number(tRaw);

  if (aRaw === "" || !Number.isFinite(amount) || amount <= 0) {
    setInputError(mortgeInput, amountError, "This field is required");
    isValid = false;
  } else {
    setInputError(mortgeInput, amountError, "");
  }

  if (tRaw === "" || !Number.isFinite(term) || term <= 0 || term > 100) {
    setInputError(termInput, yearsError, "This field is required");
    isValid = false;
  } else {
    setInputError(termInput, yearsError, "");
  }

  if (rRaw === "" || !Number.isFinite(rate) || rate < 0) {
    setInputError(rateInput, rateError, "This field is required");
    isValid = false;
  } else {
    setInputError(rateInput, rateError, "");
  }

  if (!selectedType) {
    setTypeError("This field is required");
    isValid = false;
  } else {
    setTypeError("");
  }

  return isValid;
}

function calculateRepayment() {
  if (!validateInputs()) {
    return;
  }

  const amount = Number(mortgeInput.value.trim());
  const term = Number(termInput.value.trim());
  const rate = Number(rateInput.value.trim());
  const mortgageType = document.querySelector(
    'input[name="mortgage-type"]:checked'
  ).value;

  const n = term * 12;
  const r = rate / 100 / 12;

  let monthlyPayment;
  let totalPayment;

  if (mortgageType === "repayment") {
    if (r === 0) {
      monthlyPayment = amount / n;
    } else {
      const factor = Math.pow(1 + r, n);
      monthlyPayment = amount * ((r * factor) / (factor - 1));
    }
    totalPayment = monthlyPayment * n;
  } else {
    monthlyPayment = amount * r;
    totalPayment = monthlyPayment * n;
  }

  monthlyRepayment.textContent = gbpFormatter.format(monthlyPayment);
  totalRepayment.textContent = gbpFormatter.format(totalPayment);

  emptyState.hidden = true;
  calculationResult.hidden = false;
}


mortgeInput.addEventListener("input", () => setInputError(mortgeInput, amountError, ""));
termInput.addEventListener("input", () => setInputError(termInput, yearsError, ""));
rateInput.addEventListener("input", () => setInputError(rateInput, rateError, ""));
typeInputs.forEach((radio) => {
  radio.addEventListener("change", () => setTypeError(""));
});

mortgageForm.addEventListener("submit", function (event) {
  event.preventDefault();
  calculateRepayment();
});

clearBtn.addEventListener("click", function (event) {
  event.preventDefault();
  mortgageForm.reset();

  setInputError(mortgeInput, amountError, "");
  setInputError(termInput, yearsError, "");
  setInputError(rateInput, rateError, "");
  setTypeError("");

  calculationResult.hidden = true;
  emptyState.hidden = false;
});