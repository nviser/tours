import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setSelectedPropertySuggestions } from '../../../../../actions/suggestActions';
import { selectRoutes } from '../../../../../actions/routes';
import { setProperties } from '../../../../../actions/mapActions';
import ApiService from '../../../../../services/ApiService/ApiService';
import { propertiesPath } from '../../../../../utils/paths';
import './TourPoint.css';
import { withRouter } from 'react-router-dom';
import ReactImageFallback from 'react-image-fallback';
import noImg from '../../../../../assets/img/icons/no-photo.png';
import loaderImg from '../../../../../assets/img/loading.gif';
import { API_URL } from '../../../../../config';
import { EditDropDown } from './EditDropdown/EditDropDown';

const mapStateToProps = state => ({
  editedRouteId: state.routes.editedRouteId,
  properties: state.map.properties,
  routeStopParams: state.map.routeStopParams,
  selectedRoutePoints: state.routes.selectedRoutePoints,
  waypoints: state.map.waypoints,
});

const mapDispatchToProps = {
  setSelectedPropertySuggestions,
  selectRoutes,
  setProperties,
};

class TourPoint extends Component {
  state = {
    postPropertyAddress: 'Loading...',
  };

  componentDidMount() {
    if (this.props.postData.property_id) {
      this.getProperty(this.props.postData.property_id);
    }
  }

  getProperty = propertyId => {
    this.Api.getComponent(`${propertiesPath}/${propertyId}`)
      .then(res => {
        if (
          res.data.property_info &&
          res.data.property_info.property_address_full
        ) {
          this.setState({
            postPropertyAddress: res.data.property_info.property_address_full,
          });
        }
        if (res.data) {
          const props = [...this.props.properties];
          let prepareProps = {
            id: res.data.id,
            coords: res.data.geo_location.geometry.coordinates,
          };
          let prop = props.find(prop => prop.id === res.data.id);
          if (!prop) {
            props.push(prepareProps);
            this.props.setProperties(props);
          }
        }
      })
      .catch(err => console.log(err));
  };

  Api = new ApiService();

  editPoint = () => {
    this.props.history.push(
      `/tours/create/tour_stop_edit/${this.props.postData.id}`
    );
  };

  setAddress = info => {
    const arr = [];
    [
      info.property_address_city,
      info.property_address_state,
      info.property_address_zip,
    ].forEach(item => {
      if (item) {
        arr.push(item);
      }
    });
    return arr.join(', ');
  };
  render() {
    const { props } = this;
    let file = '';
    let attachments = props.postData.attachments;
    if (attachments && attachments[0]) {
      for (let i = 0; i < attachments.length; i++) {
        if (attachments[i]['file']['mime_type'].slice(0, 5) === 'image') {
          file = `${API_URL}/posts/${attachments[i]['post_id']}/attachments/${
            attachments[i]['file']['id']
          }?width=480`;
          break;
        }
      }
    }
    return (
      <div>
        <div className="tour-point">
          {!props.notEditable && (
            <div className="dragger">
              <div className="dash" />
              <div className="dash" />
              <div className="dash" />
            </div>
          )}
          <div className="preview-image">
            <ReactImageFallback
              src={file}
              initialImage={loaderImg}
              fallbackImage={noImg}
              alt="tour_img"
              className="icon-img"
            />
          </div>
          <div className="tour-point-info">
            <h3 className="title">{props.postData.title}</h3>
            <div className="address">
              {props.postData.property
                ? this.setAddress(props.postData.property.info)
                : ''}
            </div>
          </div>
          <div className="number">{props.number}</div>

          {!this.props.notEditable && (
            <EditDropDown
              onEdit={this.editPoint}
              onDelete={() => {
                this.props.removePoint(props.postData.id);
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

TourPoint.defaultProps = {
  postData: null,
  notEditable: false,
  active: false,
};
TourPoint.propTypes = {
  postData: PropTypes.instanceOf(Object),
  notEditable: PropTypes.bool,
  active: PropTypes.bool,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TourPoint)
);
