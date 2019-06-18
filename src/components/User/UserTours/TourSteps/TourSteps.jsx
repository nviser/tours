import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './TourSteps.css';

const steps = [
  {
    id: 1,
    number: '1',
    title: 'Tour Info',
  },
  {
    id: 2,
    number: '2',
    title: 'Tour Stops',
  },
  {
    id: 3,
    number: '3',
    title: 'Tour Preview',
  },
];

const activeStep = (stepInner, stepOuter) =>
  stepInner === stepOuter ? 'active' : '';

const showSeparator = index => steps.length !== +index + 1;

const checkStep = (active, itemNumber) => {
  if (active <= itemNumber) {
    return <span className="step-number">{itemNumber}</span>;
  }
  return (
    <span className="step-number padding">
      <i className="fa fa-check" aria-hidden="true" />
    </span>
  );
};
const TourSteps = ({ stepActive }) => (
  <div className="steps-block">
    {steps.map((item, index) => (
      <Fragment key={item.id}>
        <div className={`step-item ${activeStep(item.number, stepActive)}`}>
          {checkStep(stepActive, item.number)}
          <span className="step-title">{item.title}</span>
        </div>
        {showSeparator(index) && <div className="separator" />}
      </Fragment>
    ))}
  </div>
);

TourSteps.defaultProps = {
  stepActive: null,
};

TourSteps.propTypes = {
  stepActive: PropTypes.string,
};

export default TourSteps;
