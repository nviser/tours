import React from 'react';
import PropTypes from 'prop-types';
import { Panel, PageHeader, Image } from 'react-bootstrap';
import PropertiesService from '../../services/PropertiesService/PropertiesService';
import propertyBackgroundImage from '../../assets/img/property_bg.jpg';
import './PropertyData.css';

const PropDataService = new PropertiesService();

const PropertyData = props => (
  <div
    className="container-data"
    onClick={() => props.goTo && props.goTo('property', props.property_id)}
  >
    <div className="container-background">
      <Image
        className="container-bg-img"
        responsive
        src={propertyBackgroundImage}
        alt="background_image"
      />
      <Panel className="info-panel">
        <Panel.Body>
          <PageHeader>
            {PropDataService.setPropertyByType(props.property_data, 'address')}
            {/* <br />
            <small>
              { PropDataService.setPropertyByType(props.property_data, 'address') }
            </small> */}
          </PageHeader>
        </Panel.Body>
      </Panel>
    </div>
  </div>
);

PropertyData.defaultProps = {
  property_id: null,
  property_data: null,
  goTo: null,
};
PropertyData.propTypes = {
  property_id: PropTypes.string,
  property_data: PropTypes.instanceOf(Object),
  goTo: PropTypes.func,
};
export default PropertyData;
