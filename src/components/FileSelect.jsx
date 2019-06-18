import React from 'react';
import PropTypes from 'prop-types';
import InputErrors from './InputErrors/InputErrors';

const FileSelect = ({
  id,
  type,
  label,
  value,
  className,
  wrapperClass,
  onChange,
  isRequired,
  errors,
  maxSize,
  onSelect,
}) => {
  let inputFile = null;

  const selectingFile = file => {
    if (file && file.size <= maxSize * 1024 * 1000) {
      inputFile.classList.remove('error');
      onSelect(file);
      onChange(file.name, id);
    } else {
      inputFile.classList.add('error');
    }
  };

  const clearInputFile = () => {
    inputFile.value = null;
    onChange('', id);
  };

  const hasValue = value && value.length > 0;
  const displayValue = hasValue ? value : null;

  return (
    <div
      className={`${wrapperClass} form-control-group-file ${
        hasValue ? 'loaded' : ''
      }`}
    >
      <label
        role="presentation"
        htmlFor={id}
        onClick={() => {
          inputFile.classList.remove('error');
        }}
        className="nav-item-text nav-item-file-button"
      >
        <input
          id={id}
          className={`form-control ${className}`}
          type={type}
          ref={ref => {
            inputFile = ref;
          }}
          hidden
          disabled={hasValue}
          onChange={e => {
            selectingFile(e.target.files[0]);
          }}
        />
        <InputErrors errors={errors} />
        <span>{label}</span>
        {isRequired && <sup className="text-color-danger">*</sup>}
      </label>
      <small className="form-control-file-name">{displayValue}</small>
      <button
        className="btn-close form-control-file-clear"
        onClick={() => {
          clearInputFile();
        }}
      >
        <i className="icon-close" />
      </button>
    </div>
  );
};

FileSelect.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  maxSize: PropTypes.number,
  label: PropTypes.string,
  className: PropTypes.string,
  wrapperClass: PropTypes.string,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.object),
};

FileSelect.defaultProps = {
  id: null,
  type: null,
  value: '',
  maxSize: 5,
  label: null,
  className: null,
  wrapperClass: null,
  onChange: null,
  isRequired: false,
  errors: [
    {
      type: 'maxSize',
      message: 'max size 5MB exceeded',
    },
  ],
};

export default FileSelect;
