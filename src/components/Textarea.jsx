import React from 'react';
import PropTypes from 'prop-types';
import './Textarea.css';
const Textarea = ({
  id,
  label,
  value,
  className,
  wrapperClass,
  onChange,
  isRequired,
  labelPosition,
  placeholder,
}) => {
  const activeClass =
    value && (value || value.length > 0) ? 'control-active' : 'control-empty';
  const labelClass = labelPosition ? `form-control-label-${labelPosition}` : '';
  return (
    <div className={wrapperClass}>
      <label htmlFor={id} className={`regular-label ${labelClass}`}>
        <span>{label}</span>
        {isRequired && <sup className="warn-color">*</sup>}
      </label>
      <textarea
        id={id}
        rows="6"
        className={`form-control form-control-textarea ${className} ${activeClass}`}
        value={value}
        onChange={e => {
          onChange(e.target.value, id);
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

Textarea.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  labelPosition: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  wrapperClass: PropTypes.string,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  placeholder: PropTypes.string,
};

Textarea.defaultProps = {
  id: null,
  value: '',
  labelPosition: '',
  label: null,
  className: null,
  wrapperClass: null,
  onChange: null,
  isRequired: false,
  placeholder: null,
};

export default Textarea;
