import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import AutosuggestComponent from '../../../AutosuggestComponent/AutosuggestComponent';
import { setLoader } from '../../../../actions/loaderActions';
import {
  setRouteStopMarker,
  setMapCenter,
  setWaypoints,
  setPoint,
} from '../../../../actions/mapActions';
import Header from '../../../../components/Header/Header';
import InputErrors from '../../../InputErrors/InputErrors';
import Input from '../../../Input';
import MapPanel from '../../../MapPanel/MapPanel';
import TourSteps from '../TourSteps/TourSteps';
import ApiService from '../../../../services/ApiService/ApiService';
import {
  postsPath,
  tourStopListPath,
  propertySearchPath,
  routesApiPath,
} from '../../../../utils/paths';
import Textarea from '../../../Textarea';
import './TourStopEdit.css';
import {
  setSelectedPropertySuggestions,
  setSelectedWorkCompanySuggestions,
  setSelectedPerDocCompanySuggestions,
  setSelectedHistDocCompanySuggestions,
} from '../../../../actions/suggestActions';
import {
  setMultimediaFile,
  setPhotos,
  setAudioFile,
} from '../../../../actions/tours';
import SearchService from '../../../../services/SearchService/SearchService';
import MultimediaPhotosEdit from '../TourStop/MultimediaPhotosEdit/MultimediaPhotosEdit';
import PreviewTourStop from '../TourStop/PreviewTourStop/PreviewTourStop';
import './TourStopEdit.css';
import BottomNavigationPanel from '../BottomNavigationPanel/BottomNavigationPanel';
import { setPosts } from '../../../../actions/postActions';
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
  posts: state.posts,
});

const mapDispatchToProps = {
  setLoader,
  setRouteStopMarker,
  setMapCenter,
  setWaypoints,
  setPoint,
  setPosts,
  setSelectedPropertySuggestions,
  setSelectedWorkCompanySuggestions,
  setSelectedPerDocCompanySuggestions,
  setSelectedHistDocCompanySuggestions,
  setMultimediaFile,
  setPhotos,
  setAudioFile,
};

class TourStopEdit extends Component {
  state = {
    errors: '',
    form: {},
    post: null,
    preview: false,
    data: null,
  };
  componentDidMount = () => {
    const draftTourData = localStorage.getItem('draftTourCreateData');
    // console.log('Draft', draftTourData);
    if (draftTourData) {
      this.DRAFT_TOUR_DATA = JSON.parse(draftTourData);
    }
    this.getPostData(this.props.match.params.id);
    this.isPostAttachmentsChanged = false;
  };

  // componentWillReceiveProps(nextProps) {
  //   if (
  //     nextProps.photos !== this.props.photos ||
  //     nextProps.multimedia !== this.props.multimedia
  //   ) {
  //     this.isPostAttachmentsChanged = true;
  //   }
  // }

  ApiService = new ApiService();
  Search = new SearchService();
  onChange = (value, name) => {
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
  };
  getPostData = id => {
    const parseAddress = data => {
      const propertyInfo = data.property.info;
      return propertyInfo.property_address_full
        ? propertyInfo.property_address_full.full_address
        : propertyInfo.property_address_city +
            ', ' +
            propertyInfo.property_address_state;
    };
    this.ApiService.getComponent(`${postsPath}/${id}`)
      .then(response => {
        this.setState({
          post: response.data,
          form: {
            tourStopDescr: response.data.content,
            title: response.data.title,
          },
        });
        // this.getCoordinates(response.data.title)
        this.getCoordinates(parseAddress(response.data));
        this.attachmentsHandler(response.data.attachments);
      })
      .catch(e => {});
  };
  attachmentsHandler = attachments => {
    let photos = [...this.props.photos];
    for (let i = 0; i < attachments.length; i++) {
      if (attachments[i].file.mime_type.slice(0, 5) === 'image') {
        photos.push(attachments[i].file);
        this.props.setPhotos(photos);
      } else if (attachments[i].file.mime_type.slice(0, 5) === 'video') {
        this.props.setMultimediaFile(attachments[i].file);
      } else if (attachments[i].file.mime_type.slice(0, 5) === 'audio') {
        this.props.setAudioFile(attachments[i].file);
      }
    }
  };
  setMarker = marker => {
    this.setStopMarker(marker);
  };
  getCoordinates = query => {
    this.Search.searchProperty(propertySearchPath, query).then(res => {
      this.onSuggestionSelected(null, {
        suggestion: res.data[0],
        suggestionValue: query,
      });
    });
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
  placeStopPoint = id => {
    let prepareDataValidate = this.prepareData();
    if (prepareDataValidate) {
      this.setState({ preview: true, data: this.prepareData() });
    }
  };

  prepareData = () => {
    if (!this.props.propertyData.value && !this.state.form.tourStopDescr) {
      this.setState({
        errors: {
          title: 'Title is required',
          description: 'Description is required',
        },
      });
      return false;
    } else if (!this.props.propertyData.value) {
      this.setState({ errors: { title: 'Title is required' } });
      return false;
    } else if (!this.state.form.tourStopDescr) {
      this.setState({ errors: { description: 'Description is required' } });
      return false;
    }
    const data = {
      user_id: this.props.auth.userData.id,
      company_id: null,
      property_id: this.props.propertyData.placeId,
      title: this.state.form.title,
      content: this.state.form.tourStopDescr,
      post_type_id: 1,
      event_date: Date.now(),
      placeId: this.props.propertyData.placeId,
      post: this.state.post,
    };
    this.setState({ errors: {} });
    return data;
  };
  resetMultimediaAndPhotos = () => {
    this.props.setPhotos([]);
    this.props.setMultimediaFile(null);
  };
  goTo = path => {
    this.resetMultimediaAndPhotos();
    this.props.history.push(path);
  };
  cancelPreview = () => {
    this.setState({ preview: false });
  };

  detachPostFromTour = postId => {
    const { tourId } = this.DRAFT_TOUR_DATA;
    const data = { posts: [postId] };
    return this.ApiService.sendComponent(
      data,
      `${routesApiPath}/${tourId}/detach-posts`
    ).then(() => {
      return this.ApiService.deleteComponent(`${postsPath}/${postId}`).then(
        () => {
          let posts = [...this.props.posts];
          let newPosts = posts.filter(post => post.id !== postId);
          let waypoints = [...this.props.waypoints];
          let newWaypoints = waypoints.filter(
            waypoint => waypoint.id !== postId
          );
          this.props.setWaypoints(newWaypoints);
          let points = newWaypoints.map(point => {
            return [point.lng, point.lat];
          });
          this.props.setPoint(points);
          return this.props.setPosts(newPosts);
        }
      );
    });
  };

  completeStopHandler = () => {
    //  console.log(this.props.routeStopMarker)

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

        return this.detachPostFromTour(this.state.post.id).then(() => {
          return this.attachPointToTour(res.data.id);
        });
      })
      .catch(e => {
        console.log(e);
        this.props.setLoader(false);
      });
  };
  attachPointToTour = id => {
    console.log('routeStopParams:: ', this.props.routeStopParams);

    const { tourId } = this.DRAFT_TOUR_DATA;
    const data = { posts: [id] };
    this.ApiService.sendComponent(
      data,
      `${routesApiPath}/${tourId}/attach-posts`
    )
      .then(() => {
        this.props.setLoader(false);
        if (this.isPostAttachmentsChanged) {
          this.setPostAttachments(id);
        } else {
          this.props.history.push(tourStopListPath);
        }
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };

  setPostAttachments = id => {
    let fd = new FormData();
    if (this.props.photos.length > 0) {
      let photos = this.props.photos;
      let count = Object.keys(photos).length;

      for (let i = 0; i < count; i++) {
        // if(photos[i]['path']) {
        //     fd.append("file" + (i + 1), this.dataURItoBlob(photos[i]['path']));
        // } else {
        fd.append('file' + (i + 1), photos[i]);
        // }
      }
    }
    if (this.props.multimedia) {
      fd.append('file55', this.props.multimedia);
    }
    if (this.props.photos.length > 0 || this.props.multimedia) {
      this.props.setLoader(true);
      this.ApiService.uploadFiles(fd, `${postsPath}/${id}/attachments`)
        .then(res => {
          this.props.setMultimediaFile(null);
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
    this.isPostAttachmentsChanged = false;
  };

  render() {
    return (
      <div className="stop-page">
        <div className="stop-wrap">
          <HeaderMobile />
          <Header hideSearch />
          <div className="stop-container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid edit-point">
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
                            <div className="tour-stop-error">
                              {this.state.errors &&
                                this.state.errors.description}
                            </div>
                            <Textarea
                              id="tourStopDescr"
                              label="Description of Tour Stop"
                              value={this.state.form.tourStopDescr}
                              wrapperClass="stop-descr"
                              onChange={this.onChange}
                              labelPosition="top-left"
                              placeholder="Type your description"
                            />
                          </div>
                          <MultimediaPhotosEdit
                            onChangeAttachments={() => {
                              this.isPostAttachmentsChanged = true;
                            }}
                          />
                        </div>
                      ) : (
                        <PreviewTourStop
                          data={this.state.data}
                          cancelPreview={this.cancelPreview}
                          completeStopHandler={() =>
                            this.goTo(tourStopListPath)
                          }
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
                    path={'/tours'}
                    nextHandler={
                      !this.state.preview
                        ? this.placeStopPoint
                        : this.completeStopHandler
                    }
                    btnCancelTitle="Back"
                    btnName={`${!this.state.preview ? 'preview' : 'next'}`}
                  />
                </Col>
                <Col lg={6} md={6} sm={12} className="right-block">
                  <section className="create-tour-section">
                    <MapPanel routeStop />
                  </section>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TourStopEdit);
