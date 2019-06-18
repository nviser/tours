import React, { Component } from 'react';
import { Thumbnail } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setInfoWindow } from '../../../actions/mapActions';
import PropertiesService from '../../../services/PropertiesService/PropertiesService';
import propertyBackgroundImage from '../../../assets/img/property_bg.jpg';
import './PropertyMapBlock.css';

const mapDispatchToProps = {
  setInfoWindow,
};

class PropertyMapBlock extends Component {
  state = {
    isActive: false,
  };

  PropDataService = new PropertiesService();

  openInfoWindow = () => {
    this.props.setInfoWindow({
      address: this.PropDataService.setPropertyByType(
        this.props.property,
        'address'
      ),
      // content: this.PropDataService.setPropertyByType(this.props.property, 'address'),
      id: this.props.property.id,
    });
    this.toggleActive();
  };

  toggleActive = () => {
    this.setState({
      isActive: !this.state.isActive,
    });
  };
  render() {
    return (
      <div
        className={`property-map-block ${
          this.state.isActive ? 'activated' : ''
        }`}
        onMouseOver={this.openInfoWindow}
        onMouseOut={this.toggleActive}
      >
        <Thumbnail src={propertyBackgroundImage} alt="242x200">
          <h3>
            {this.PropDataService.setPropertyByType(
              this.props.property,
              'address'
            )}
          </h3>
          {/* <p>{
            this.PropDataService.setPropertyByType(this.props.property, 'address')
          }
          </p> */}
        </Thumbnail>
      </div>
    );
  }
}

PropertyMapBlock.defaultProps = {
  property: null,
};

PropertyMapBlock.propTypes = {
  property: PropTypes.instanceOf(Object),
  setInfoWindow: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(PropertyMapBlock);
