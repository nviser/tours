import React from 'react';
import './DashboardGreeting.css';
import PropTypes from 'prop-types';

const DashboardGreeting = ({ cancelHandler, clickHandler, options }) => {
  return (
    <div className="dashboard-greeting">
      <div className="welcome">Welcome!</div>
      <div className="description">{options.message}</div>
      <div className="cancel" onClick={cancelHandler} />
      <button className="btn-greeting-action" onClick={clickHandler}>
        {options.buttonTitle}
      </button>
    </div>
  );
};

DashboardGreeting.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  clickHandler: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
};

export default DashboardGreeting;
