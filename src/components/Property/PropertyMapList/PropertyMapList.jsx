import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PropertyMapBlock from '../PropertyMapBlock/PropertyMapBlock';
import './PropertyMapList.css';

const mapStateToProps = state => ({
  allProperties: state.map.allProperties,
});

const PropertyMapList = props => (
  <div className="property-map-list">
    <ul>
      {props.allProperties.map(property => (
        <li className="property-map-item" key={property.id}>
          <PropertyMapBlock property={property} />
        </li>
      ))}
    </ul>
  </div>
);

PropertyMapList.defaultProps = {
  allProperties: [],
};

PropertyMapList.propTypes = {
  allProperties: PropTypes.instanceOf(Array),
};

export default connect(mapStateToProps)(PropertyMapList);
