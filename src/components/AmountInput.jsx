import { useLayoutEffect, useRef, useState } from "react";
import { digitsOnly, formatAmountInput } from "../utils/currency";

function caretFromDigitCount(value, digitCount) {
  if (digitCount <= 0) {
    return 0;
  }
  let seen = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (/\d/.test(value[index])) {
      seen += 1;
    }
    if (seen >= digitCount) {
      return index + 1;
    }
  }
  return value.length;
}

export default function AmountInput({ id, value, onChange, describedBy, error }) {
  const inputRef = useRef(null);
  const [caretDigitCount, setCaretDigitCount] = useState(null);
  const displayValue = formatAmountInput(value);

  useLayoutEffect(() => {
    if (caretDigitCount === null || !inputRef.current) {
      return;
    }
    const position = caretFromDigitCount(displayValue, caretDigitCount);
    inputRef.current.setSelectionRange(position, position);
    setCaretDigitCount(null);
  }, [caretDigitCount, displayValue]);

  const handleChange = (event) => {
    const input = event.target;
    const rawBeforeCaret = input.value.slice(0, input.selectionStart || 0);
    setCaretDigitCount(digitsOnly(rawBeforeCaret).length);
    onChange(digitsOnly(input.value));
  };

  const handleBeforeInput = (event) => {
    if (event.data && /\D/.test(event.data)) {
      event.preventDefault();
    }
  };

  return (
    <input
      ref={inputRef}
      id={id}
      className="form-control"
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={displayValue}
      placeholder="1.250.000"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={describedBy}
      onBeforeInput={handleBeforeInput}
      onChange={handleChange}
    />
  );
}
