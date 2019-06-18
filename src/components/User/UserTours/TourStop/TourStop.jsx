import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import AutosuggestComponent from '../../../AutosuggestComponent/AutosuggestComponent';
import { setLoader } from '../../../../actions/loaderActions';
import {
  setRouteStopMarker,
  setMapCenter,
  setWaypoints,
  setPoint,
} from '../../../../actions/mapActions';
import Header from '../../../../components/Header/Header';
import MapPanel from '../../../MapPanel/MapPanel';
import TourSteps from '../TourSteps/TourSteps';
import ApiService from '../../../../services/ApiService/ApiService';
import {
  postsPath,
  tourStopListPath,
  routesApiPath,
} from '../../../../utils/paths';
import { DEFAULT_MAP_PARAMS } from '../../../../utils/const';
import Textarea from '../../../Textarea';
import Input from '../../../Input';
import './TourStop.css';
import {
  setSelectedPropertySuggestions,
  setSelectedWorkCompanySuggestions,
  setSelectedPerDocCompanySuggestions,
  setSelectedHistDocCompanySuggestions,
} from '../../../../actions/suggestActions';
import UploadMultimediaPanel from './UploadMultimediaPanel/UploadMultimediaPanel';
import MultimediaPhotosEdit from './MultimediaPhotosEdit/MultimediaPhotosEdit';
import PreviewTourStop from './PreviewTourStop/PreviewTourStop';
import {
  setMultimediaFile,
  setPhotos,
  setAudioFile,
} from '../../../../actions/tours';
import { setTourEditable } from '../../../../actions/routes';
import BottomNavigationPanel from '../BottomNavigationPanel/BottomNavigationPanel';
import InputErrors from '../../../InputErrors/InputErrors';
import HeaderMobile from '../../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
  propertyData: state.suggest.selectedPropertySuggestion,
  editedRouteId: state.routes.editedRouteId,
  suggestedValue: state.suggest.selectedPropertySuggestion.value,
  routeStopMarker: state.map.routeStopMarker,
  routeStopParams: state.map.routeStopParams,
  waypoints: state.map.waypoints,
  points: state.map.points,
  propertyValue: state.suggest.selectedPropertySuggestion.value,
  multimedia: state.tours.multimedia,
  photos: state.tours.photos,
  audio: state.tours.audio,
});

const mapDispatchToProps = {
  setLoader,
  setRouteStopMarker,
  setMapCenter,
  setWaypoints,
  setPoint,
  setSelectedPropertySuggestions,
  setSelectedWorkCompanySuggestions,
  setSelectedPerDocCompanySuggestions,
  setSelectedHistDocCompanySuggestions,
  setMultimediaFile,
  setPhotos,
  setAudioFile,
  setTourEditable,
};

const TourStop = withRouter(props => <TourStopComponent {...props} />);

class TourStopComponent extends Component {
  state = {
    form: {},
    errors: {},
    preview: false,
    data: null,
  };

  componentDidMount() {
    const draftTourData = localStorage.getItem('draftTourCreateData');
    // console.log('Draft', draftTourData);
    if (draftTourData) {
      this.DRAFT_TOUR_DATA = JSON.parse(draftTourData);
    }
    if (!this.props.auth.isLoggedIn) {
      this.props.history.push('/');
    }
  }

  componentWillUnmount() {
    this.props.setSelectedPropertySuggestions({});
    this.props.setMapCenter(DEFAULT_MAP_PARAMS);
  }

  onChange = (value, name) => {
    if (value.length <= 2000) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
        errors: {},
      });
    }
  };

  setMarker = marker => {
    this.setStopMarker(marker);
  };

  setStopMarker = marker => {
    const geocoder = new window.google.maps.Geocoder();

    return geocoder.geocode({ placeId: marker }, (results, status) => {
      if (status === 'OK') {
        this.props.setRouteStopMarker({
          coords: [
            results[0].geometry.location.lat(),
            results[0].geometry.location.lng(),
          ],
        });
      }
    });
  };

  prepareData = () => {
    const _errors = {};
    let locationValidate = this.locationValidateHandler();

    if (!this.state.form.title)
      _errors['title'] = [
        {
          message: 'Title is required.',
        },
      ];
    if (!this.state.form.tourStopDescr)
      _errors['description'] = [
        {
          message: 'Description is required.',
        },
      ];
    if (!this.props.propertyData.value)
      _errors['address'] = [
        {
          message: 'Address is required.',
        },
      ];
    if (!locationValidate)
      _errors['location'] = [
        {
          message: 'To long distance from previous location.',
        },
      ];

    if (Object.keys(_errors).length) {
      window.scrollTo(0, 0);
      this.setState({
        errors: _errors,
      });
      return false;
    } else {
      const data = {
        user_id: this.props.auth.userData.id,
        company_id: null,
        property_id: this.props.propertyData.placeId,
        title: this.state.form.title,
        content: this.state.form.tourStopDescr,
        post_type_id: 1,
        event_date: Date.now(),
        placeId: this.props.propertyData.placeId,
      };

      this.setState({ errors: {} });
      return data;
    }
  };

  // getTourStopsData = () => {
  //   this.props.setLoader(true);
  //   const { tourId } = this.DRAFT_TOUR_DATA;
  //   this.ApiService.getComponent(`${routesApiPath}/${tourId}/attach-posts`)
  //     .then(res => {
  //       this.props.setLoader(false);
  //       console.log(res);
  //     })
  //     .catch(() => {
  //       this.props.setLoader(false);
  //     });
  // };

  attachPointToTour = id => {
    const { tourId } = this.DRAFT_TOUR_DATA;
    const data = { posts: [id] };
    console.log('routeStopParams:: ', this.props.routeStopParams);
    this.ApiService.sendComponent(
      data,
      `${routesApiPath}/${tourId}/attach-posts`
    )
      .then(() => {
        this.props.setLoader(false);
        this.setPostAttachments(id);
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };

  placeStopPoint = id => {
    let prepareDataValidate = this.prepareData();
    this.props.setTourEditable(true);

    if (prepareDataValidate) {
      this.setState({ preview: true, data: prepareDataValidate });
    }
  };
  setPostAttachments = id => {
    let fd = new FormData();
    if (this.props.photos.length > 0) {
      let photos = this.props.photos;
      let count = Object.keys(photos).length;

      for (let i = 0; i < count; i++) {
        fd.append('file' + (i + 1), photos[i]);
      }
    }
    if (this.props.multimedia) {
      fd.append('file55', this.props.multimedia);
    }
    if (this.props.audio) {
      fd.append('file56', this.props.audio);
    }
    if (this.props.photos.length > 0 || this.props.multimedia) {
      this.props.setLoader(true);
      this.ApiService.uploadFiles(fd, `${postsPath}/${id}/attachments`)
        .then(res => {
          this.props.setMultimediaFile(null);
          this.props.setAudioFile(null);
          this.props.setPhotos([]);
          this.props.history.push(tourStopListPath);
          this.props.setLoader(false);
        })
        .catch(e => {
          this.props.setLoader(false);
          console.log(e);
        });
    } else {
      this.props.history.push(tourStopListPath);
    }
  };
  completeStopHandler = () => {
    this.props.setLoader(true);
    this.ApiService.sendComponent(this.state.data, postsPath)
      .then(res => {
        const points = [...this.props.points];
        points.push([
          this.props.routeStopMarker.coords[1],
          this.props.routeStopMarker.coords[0],
        ]);
        this.props.setPoint(points);
        const waypoints = [...this.props.waypoints];
        const newMarkers = {
          id: res.data.id,
          lat: this.props.routeStopMarker.coords[0],
          lng: this.props.routeStopMarker.coords[1],
        };
        waypoints.push(newMarkers);
        this.props.setWaypoints(waypoints);
        this.attachPointToTour(res.data.id);
      })
      .catch(e => {
        console.log(e);
        this.props.setLoader(false);
      });
  };

  locationValidateHandler = () => {
    let points = [...this.props.points];
    if (points.length) {
      let mediumPoint = points[0][1];
      let maxPoint = mediumPoint + 5;
      let minPoint = mediumPoint - 5;
      let currentLng = this.props.routeStopMarker.coords[0];
      if (currentLng <= maxPoint && currentLng >= minPoint) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  };

  goTo = path => {
    this.props.history.push(path);
  };

  ApiService = new ApiService();

  onSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    if (suggestion && suggestionValue) {
      this.props.setSelectedPropertySuggestions({
        value: suggestionValue,
        propertyId: suggestion.id,
        placeId: suggestion.place_id,
      });
      this.setMarker(suggestion.place_id);
    }
  };
  onCancel = () => {};
  cancelPreview = () => {
    this.setState({ preview: false });
  };
  render() {
    return (
      <div className="stop-page">
        <div className="stop-wrap">
          <HeaderMobile />
          <Header hideSearch />
          <div className="stop-container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid no-margin">
                <Col lg={6} md={6} sm={12} className="left-block">
                  <div className="left-panel">
                    <div className="stop-main-block">
                      <TourSteps stepActive="2" />
                      {!this.state.preview ? (
                        <div>
                          <div
                            className={`stop-title-block ${
                              this.props.suggestedValue ? 'suggest-active' : ''
                            }`}
                          >
                            <h4 className="stop-header">
                              Enter your route stop
                            </h4>
                            <Input
                              id="title"
                              label="Stop Title"
                              wrapperClass="stop-title"
                              value={this.state.form.title}
                              onChange={this.onChange}
                              labelPosition="top-left"
                              errors={this.state.errors.title}
                              placeHolder="Enter title"
                            />
                            <label htmlFor="" className="modal-sign-in-label">
                              Address
                            </label>
                            <AutosuggestComponent
                              id="autosuggest"
                              suggestionType="property"
                              noReset
                              errors={
                                this.state.errors.address ||
                                this.state.errors.location
                              }
                              placeholder="Type here to search"
                              getAllData={this.props.getAllData}
                              setMarker={this.setMarker}
                              onSuggestionSelected={this.onSuggestionSelected}
                              propertyValue={this.props.propertyValue}
                            />
                            <InputErrors
                              errors={
                                this.state.errors.address ||
                                this.state.errors.location
                              }
                            />
                          </div>

                          <div className="stop-description">
                            <Textarea
                              id="tourStopDescr"
                              label="Description of Tour Stop"
                              value={this.state.form.tourStopDescr}
                              wrapperClass={`stop-descr ${
                                this.state.errors.description &&
                                this.state.errors.description.length
                                  ? 'has-errors'
                                  : ''
                              }`}
                              onChange={this.onChange}
                              labelPosition="top-left"
                              placeholder="Type your description"
                            />
                            <div className="stop-description-addons">
                              <InputErrors
                                errors={this.state.errors.description}
                              />
                              <div className="symbol-count">
                                {this.state.form.tourStopDescr
                                  ? this.state.form.tourStopDescr.length
                                  : 0}{' '}
                                /2000
                              </div>
                            </div>
                          </div>
                          {!this.props.multimedia &&
                          !this.props.audio &&
                          !this.props.photos.length > 0 ? (
                            <UploadMultimediaPanel />
                          ) : (
                            <MultimediaPhotosEdit />
                          )}
                        </div>
                      ) : (
                        <PreviewTourStop
                          data={this.state.data}
                          cancelPreview={this.cancelPreview}
                          completeStopHandler={this.completeStopHandler}
                        />
                      )}
                    </div>
                  </div>
                  <BottomNavigationPanel
                    backHandler={
                      !this.state.preview
                        ? () => this.goTo(tourStopListPath)
                        : this.cancelPreview
                    }
                    path={tourStopListPath}
                    nextHandler={
                      !this.state.preview
                        ? this.placeStopPoint
                        : this.completeStopHandler
                    }
                    btnCancelTitle="Back"
                    btnName={`${!this.state.preview ? 'preview' : 'next'}`}
                  />
                </Col>
                <Col lg={6} md={6} sm={12} className="map-container">
                  <section className="create-tour-section">
                    <MapPanel routeStop />
                  </section>
                </Col>
              </Row>
            </Grid>
          </div>
          {/*<Footer />*/}
        </div>
      </div>
    );
  }
}
TourStopComponent.defaultProps = {
  editedRouteId: null,
  suggestedValue: null,
};

TourStopComponent.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  auth: PropTypes.instanceOf(Object).isRequired,
  propertyData: PropTypes.instanceOf(Object).isRequired,
  setRouteStopMarker: PropTypes.func.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  setSelectedPropertySuggestions: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  editedRouteId: PropTypes.number,
  suggestedValue: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TourStop);
