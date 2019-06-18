import React from 'react';
import PropTypes from 'prop-types';

const Select = ({
  selectId,
  selectValue,
  label,
  options,
  className,
  wrapperClass,
  onChange,
  isRequired,
  isDisabled,
  fieldToShow,
  fieldToSend,
  placeHolder,
}) => {
  const activeClass =
    selectValue.length > 0 ? 'control-active' : 'control-empty';

  return (
    <div className={`${wrapperClass} form-control-select-group ${activeClass}`}>
      <label htmlFor={selectId} className="modal-sign-in-label">
        <span>{label}</span>
        {isRequired && <sup className="warn-color">*</sup>}
      </label>
      <select
        id={selectId}
        defaultValue={selectValue}
        className={`form-control form-control-select ${className}`}
        onChange={e => {
          onChange(e.target.value, selectId);
        }}
        disabled={isDisabled}
      >
        <option value="" className="hidden">
          {placeHolder}
        </option>
        {options &&
          Array.isArray(options) &&
          options.map(item => (
            <option value={item[fieldToSend]} key={item.id}>
              {item[fieldToShow]}
            </option>
          ))}
      </select>
    </div>
  );
};

Select.propTypes = {
  selectId: PropTypes.string,
  selectValue: PropTypes.string,
  fieldToShow: PropTypes.string,
  fieldToSend: PropTypes.string,
  placeHolder: PropTypes.string,
  options: PropTypes.instanceOf(Object),
  label: PropTypes.string,
  className: PropTypes.string,
  wrapperClass: PropTypes.string,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  selected: PropTypes.bool,
};

Select.defaultProps = {
  selectId: null,
  selectValue: '',
  placeHolder: '',
  options: null,
  label: null,
  className: null,
  wrapperClass: null,
  onChange: null,
  isRequired: false,
  isDisabled: false,
  fieldToShow: null,
  fieldToSend: null,
  selected: false,
};

export default Select;
