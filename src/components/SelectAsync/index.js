import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';

import { debounce } from 'lodash';

import { useField } from '@rocketseat/unform';

import { Container } from './styles';

export default function ReactSelectAsync({
  name,
  label,
  options,
  multiple,
  asyncFunc,
  ...rest
}) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  function parseSelectValue(selectRef) {
    // console.log(selectRef);
    const selectValue = selectRef.state.value;
    if (!multiple) {
      return selectValue ? selectValue.id : '';
    }
    return selectValue ? selectValue.map(option => option.id) : [];
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'state.value',
      parseValue: parseSelectValue,
      clearValue: selectRef => {
        selectRef.select.clearValue();
      },
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  const loadOptions = value => asyncFunc(value);

  const debouncedLoadOptions = debounce(loadOptions, 500, {
    leading: true,
  });
  // const debouncedLoadOptions = debounce(
  //   value => {
  //     console.log(value);
  //   },
  //   500,
  //   {
  //     leading: true,
  //   }
  // );

  return (
    <Container>
      {label && <label htmlFor={fieldName}>{label}</label>}

      <AsyncSelect
        name={fieldName}
        aria-label={fieldName}
        ref={ref}
        loadOptions={inputValue => debouncedLoadOptions(inputValue)}
        isMulti={multiple}
        getOptionValue={option => option.id}
        getOptionLabel={option => option.title}
        placeholder=""
        {...rest}
      />

      {error && <span>{error}</span>}
    </Container>
  );
}

ReactSelectAsync.propTypes = {
  name: PropTypes.string.isRequired,
  // label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  multiple: PropTypes.bool,
  asyncFunc: PropTypes.func.isRequired,
};

ReactSelectAsync.defaultProps = {
  multiple: false,
};
