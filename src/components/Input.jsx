import React from 'react';
import PropTypes from 'prop-types';
import InputErrors from './InputErrors/InputErrors';
import './Input.css';

const Input = ({
  id,
  type,
  label,
  value,
  className,
  wrapperClass,
  onChange,
  isRequired,
  errors,
  placeHolder,
  disabled,
}) => {
  // const activeClass = value || value.length > 0 ? 'control-active' : 'control-empty';
  return (
    <div className={wrapperClass}>
      <label htmlFor={id} className="regular-label">
        <span>{label}</span>
        {/* {isRequired && <sup className="warn-color">*</sup>} */}
      </label>
      <input
        id={id}
        className={`${className} ${
          errors && errors.length ? 'has-errors' : ''
        }`}
        type={type}
        disabled={disabled}
        value={value}
        placeholder={placeHolder}
        onChange={e => {
          onChange(e.target.value, id);
        }}
      />
      <InputErrors errors={errors} />
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  wrapperClass: PropTypes.string,
  placeHolder: PropTypes.string,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.object),
};

Input.defaultProps = {
  id: null,
  type: null,
  value: '',
  label: null,
  className: null,
  wrapperClass: null,
  onChange: null,
  isRequired: false,
  errors: [],
  disabled: false,
};

export default Input;
