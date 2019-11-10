import React, { useRef, useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input';

import { useField } from '@rocketseat/unform';

export default function InputCurrency({ name, disabled, setChange }) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'props.value',
      clearValue: el => {
        setSelected(0.0);
      },
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  function handleChange(e) {
    setSelected(e);
    setChange(e);
  }

  return (
    <>
      <CurrencyInput
        disabled={disabled}
        name={fieldName}
        value={selected}
        onChange={handleChange}
        ref={ref}
        decimalSeparator=","
        thousandSeparator="."
      />
      {error && <span>{error}</span>}
    </>
  );
}
