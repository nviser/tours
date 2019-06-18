import React from 'react';
import './Checkbox.css';
import PropTypes from 'prop-types';

const Checkbox = ({ defaultChecked, changeHandler, error, id, svgId }) => {
  return (
    <div>
      <div className="svg-container">
        <svg xmlns="http://www.w3.org/2000/svg">
          <symbol id={id} viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeMiterlimit="10"
              fill="none"
              d="M22.9 3.7l-15.2 16.6-6.6-7.1"
            />
          </symbol>
        </svg>
      </div>
      <div className="form-container">
        <div className="promoted-checkbox">
          <input
            id={svgId}
            type="checkbox"
            className="promoted-input-checkbox"
            checked={defaultChecked}
            onChange={changeHandler}
          />
          <label htmlFor={svgId} className={error ? 'checkbox-error' : null}>
            <svg>
              <use xlinkHref={'#' + id} />
            </svg>
          </label>
        </div>
      </div>
    </div>
  );
};

Checkbox.defaultProps = {
  error: false,
};

Checkbox.propTypes = {
  defaultChecked: PropTypes.bool.isRequired,
  changeHandler: PropTypes.func.isRequired,
  error: PropTypes.bool,
  id: PropTypes.string.isRequired,
  svgId: PropTypes.string.isRequired,
};

export default Checkbox;
