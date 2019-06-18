import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { setLoader } from '../../../../actions/loaderActions';
import {
  setEditedRouteId,
  setRouteTitle,
  selectSingleRoute,
  setCategories,
  setCategoryColor,
} from '../../../../actions/routes';
import Header from '../../../../components/Header/Header';
//import Footer from '../../../../components/Footer/Footer';
import TourSteps from '../TourSteps/TourSteps';
import MapPanel from '../../../MapPanel/MapPanel';
import ApiService from '../../../../services/ApiService/ApiService';
import {
  getFilters,
  routesApiPath,
  tourStopListPath,
  routesPath,
} from '../../../../utils/paths';
import Input from '../../../Input';
import Textarea from '../../../Textarea';
import './TourCreate.css';
import { setPoint } from '../../../../actions/mapActions';
import withAuth from '../../../../services/withAuth/withAuth';
import { setWaypoints } from '../../../../actions/mapActions';
import Modal from '../../../UI/Modal/Modal';
import UploadPhoto from './UploadPhoto/UploadPhoto';
import { setTourPhoto } from '../../../../actions/tours';
import { API_URL } from '../../../../config';
import ReactImageFallback from 'react-image-fallback';
import noImg from '../../../../assets/img/icons/no-photo.png';
import BottomNavigationPanel from '../BottomNavigationPanel/BottomNavigationPanel';
import { CustomSelect } from '../../../CustomSelect/CustomSelect';
import HeaderMobile from '../../../HeaderMobile/HeaderMobile';
import tourPhotoValidator from './tourPhotoValidator';

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
  tourEditable: state.routes.editable,
  editedRouteId: state.routes.editedRouteId,
  isLoading: state.loader.isLoading,
  tourPhoto: state.tours.tourPhoto,
  categories: state.routes.categories,
});

const mapDispatchToProps = {
  setLoader,
  setEditedRouteId,
  setRouteTitle,
  setWaypoints,
  setPoint,
  selectSingleRoute,
  setTourPhoto,
  setCategories,
  setCategoryColor,
};

const TourCreate = withRouter(props => <TourCreateComponent {...props} />);

class TourCreateComponent extends Component {
  state = {
    form: {
      tourPrice: '',
    },
    errors: {},
    filters: {},
    ageSelect: [],
    categoriesSelect: [],
    route: null,
    mobility: [],
    showModal: false,
  };

  componentDidMount() {
    const draftTourData = localStorage.getItem('draftTourCreateData');
    // console.log('Draft', draftTourData);
    if (draftTourData) {
      this.DRAFT_TOUR_DATA = JSON.parse(draftTourData);
      this.getRouteData();
    } else {
      this.getFilters(getFilters);
    }
  }

  componentWillUnmount = () => {
    if (this.props.tourEditable) {
      this.props.setTourPhoto(null);
    }
  };

  getRouteData = async () => {
    const { tourId } = this.DRAFT_TOUR_DATA;
    await tourPhotoValidator.check(tourId);
    this.props.setLoader(true);
    this.ApiService.getComponent(`${routesPath}/${tourId}`)
      .then(response => {
        this.getFilters(getFilters);
        this.setState({ route: response.data });

        // this.ApiService.getComponent(`${routesPath}/${tourId}`)

        this.setEditableData(response.data);
        this.setMapWaypoints(response.data.waypoint.geometry.coordinates);
        this.props.setLoader(false);
      })
      .catch(e => {
        this.props.setLoader(false);
      });
  };

  setMapWaypoints = coords => {
    const posts = [...this.state.route.posts];
    const waypoints = coords.map((item, index) => {
      return {
        id: posts[index].id,
        lat: item[1],
        lng: item[0],
      };
    });
    const points = coords.map(coord => {
      return [coord[0], coord[1]];
    });
    this.props.setPoint(points);
    this.props.setWaypoints(waypoints);
  };

  setEditableData = data => {
    let newAges = this.state.ageSelect;
    let newCategories = this.state.categoriesSelect;
    if (!!data.ages && data.ages.length) {
      newAges = this.setOptionsEditableData(
        [...this.state.ageSelect],
        data.ages
      );
    }
    if (data.categories.length) {
      newCategories = this.setOptionsEditableData(
        [...this.state.categoriesSelect],
        data.categories
      );
    }

    this.setState({
      form: {
        tourTitle: data.name,
        travelMode: String(data.mobility_id),
        tourCategory: String(data.categories[0].id),
        tourDescr: data.summary,
        ageRange: data.ages && data.ages.length ? data.ages : '',
        tourPrice: String(data.cost),
      },
      ageSelect: newAges,
      categoriesSelect: newCategories,
    });
  };

  setOptionsEditableData = (items, selectedItems) => {
    let currentItemsNames = selectedItems.map(selected => selected.name);
    return items.map(item => {
      if (currentItemsNames.includes(item.label)) {
        return {
          ...item,
          value: true,
        };
      }
      return { ...item };
    });
  };
  onChange = (value, name) => {
    if (value.length <= 300 || typeof value === 'number') {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    }
  };

  prepareToOptions = items => {
    return items.map(item => {
      return {
        id: item.id,
        label: item.name,
        value: false,
      };
    });
  };
  getFilters = url => {
    this.ApiService.getComponent(url).then(res => {
      const { age, categories, mobility } = res.data;
      let agesOptions = this.prepareToOptions(age);
      this.setState({
        filters: res.data,
        ageSelect: agesOptions,
        categories,
        mobility,
      });
      this.props.setCategories(res.data.categories);
      if (this.props.editedRouteId) {
        //----------------------tourEditable
        this.setEditableData(this.state.route);
      }
    });
  };

  goTo = path => {
    this.props.history.push(path);
  };

  createOrUpdateTour = () => {
    let routeData = this.gatherRouteData();
    if (!this.DRAFT_TOUR_DATA) {
      if (this.validateForm()) {
        this.ApiService.sendComponent(routeData, routesApiPath).then(res => {
          console.log('created tour', res);
          localStorage.setItem(
            'draftTourCreateData',
            JSON.stringify({
              tourId: res.data.id,
            })
          );
          this.props.setEditedRouteId(res.data.id);
          if (this.props.tourPhoto)
            this.sendTourBackground(this.props.tourPhoto, res.data.id);
          // this.props.setRouteTitle(res.data.name)
          this.goTo(tourStopListPath);
        });
      }
    } else {
      const { tourId } = this.DRAFT_TOUR_DATA;
      console.log('update tour id', tourId);
      let posts = [...this.state.route.posts];
      if (posts.length) routeData.posts = posts.map(post => post.id);
      this.ApiService.patchComponent(
        routeData,
        `${routesApiPath}/${tourId}`
      ).then(res => {
        if (this.props.tourPhoto)
          this.sendTourBackground(this.props.tourPhoto, tourId);
        // this.props.setEditedRouteId(res.data.id);
        // this.props.setRouteTitle(res.data.name)
        this.goTo(tourStopListPath);
      });
    }
    this.props.selectSingleRoute(routeData);
  };

  sendTourBackground = (background, id) => {
    let formData = new FormData();
    formData.append('file', background);
    this.ApiService.uploadFiles(formData, `/routes/${id}/background`)
      .then(response => {
        //this.props.setTourPhoto(null);
        tourPhotoValidator.check(id);
      })
      .catch(e => {});
  };

  validateForm = async () => {
    const {
      ageRange,
      travelMode,
      tourCategory,
      tourDescr,
      tourTitle,
    } = this.state.form;

    return (
      tourCategory &&
      ageRange &&
      travelMode &&
      tourDescr &&
      tourTitle &&
      (this.props.tourPhoto || tourPhotoValidator.isPhotoExists())
    );
  };

  prepareToSend = items => {
    return items.map(item => item.id);
  };
  gatherRouteData = () => {
    const age_ids = this.prepareToSend(this.state.form.ageRange);
    this.setCategoryColor();
    return {
      category_ids: [this.state.form.tourCategory],
      name: this.state.form.tourTitle,
      summary: this.state.form.tourDescr,
      display_order: 99,
      is_circular: false,
      age_ids: age_ids,
      mobility_id: this.state.form.travelMode,
      cost: 10, //!!this.state.form.tourPrice ? this.state.form.tourPrice : 0
    };
  };

  setCategoryColor = () => {
    let categories = [...this.props.categories];
    let catId = +this.state.form.tourCategory;
    let selectedColor = categories.find(category => category.id === catId);
    this.props.setCategoryColor(selectedColor);
  };

  ApiService = new ApiService();
  optionClicked(optionsList) {
    this.setState({ ageSelect: optionsList });
  }
  selectedBadgeClicked(optionsList) {
    this.setState({ ageSelect: optionsList });
  }
  optionCatClicked(optionsList) {
    this.setState({ categoriesSelect: optionsList });
  }
  selectedCatBadgeClicked(optionsList) {
    this.setState({ categoriesSelect: optionsList });
  }
  showModal = () => {
    this.setState({
      showModal: true,
    });
  };
  closeModalHandler = () => {
    this.setState({
      showModal: false,
    });
  };
  setBackgoundImage = id => {
    return `${API_URL}/routes/${id}/background?width=400`;
  };

  render() {
    const { mobility, categories, age } = this.state.filters;
    return (
      <div className="create-tour-page">
        <div className="create-tour-wrap">
          <HeaderMobile />
          <Header hideSearch />
          <div className="create-tour-container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid">
                <Col lg={6} md={6} sm={12} className="left-block">
                  <div className="left-panel">
                    <div className="create-tour-main-block">
                      <TourSteps stepActive="1" />

                      <div className="tour-title-block">
                        <Input
                          id="tourTitle"
                          label="Tour Title"
                          className="tour-title-input email"
                          wrapperClass="form-control-group"
                          placeHolder="Insert Tour Title"
                          value={this.state.form.tourTitle}
                          type="text"
                          onChange={this.onChange}
                          errors={this.state.errors.tourTitle}
                        />
                      </div>
                      <div className="tour-select-block">
                        <CustomSelect
                          onChange={this.onChange}
                          placeholder="Select Age"
                          selected={this.state.form.ageRange}
                          options={age}
                          name="ageRange"
                          mode="multiple"
                          fieldToShow="name"
                          fieldToSend="id"
                          label="Age Range"
                        />
                        {(this.state.form.travelMode ||
                          !this.props.tourEditable) && (
                          <CustomSelect
                            onChange={this.onChange}
                            placeholder="Select Mode"
                            selected={this.state.form.travelMode}
                            options={mobility}
                            name="travelMode"
                            mode="single"
                            fieldToShow="name"
                            fieldToSend="id"
                            label="Travel Mode"
                          />
                        )}
                        {(this.state.form.tourCategory ||
                          !this.props.tourEditable) && (
                          <CustomSelect
                            onChange={this.onChange}
                            placeholder="Select Category"
                            selected={this.state.form.tourCategory}
                            options={categories}
                            name="tourCategory"
                            mode="single"
                            fieldToShow="name"
                            fieldToSend="id"
                            label="Category"
                          />
                        )}
                      </div>
                      <div className="tour-description">
                        <Textarea
                          id="tourDescr"
                          label="Description of Tour"
                          value={this.state.form.tourDescr}
                          wrapperClass="tour-descr"
                          onChange={this.onChange}
                          labelPosition="top-left"
                          placeholder="Type your description"
                        />
                        <div className="symbol-count">
                          {this.state.form.tourDescr
                            ? this.state.form.tourDescr.length
                            : 0}{' '}
                          /300
                        </div>
                      </div>
                      {/*<div className="tour-price">*/}
                      {/*{(this.state.form.tourPrice || !this.props.tourEditable) && <Select*/}
                      {/*selectId="tourPrice"*/}
                      {/*selectValue={this.state.form.tourPrice}*/}
                      {/*label="Price"*/}
                      {/*options={tourPrice}*/}
                      {/*placeHolder="Select Price"*/}
                      {/*onChange={this.onChange}*/}
                      {/*wrapperClass="tour-select"*/}
                      {/*fieldToShow="showValue"*/}
                      {/*fieldToSend="value"*/}
                      {/*/>}*/}
                      {/*{this.state.form.tourPrice && this.state.form.tourPrice > 0 && <span className="tour-info">You earn $4.82 each time this tour is purchased</span>}*/}
                      {/*</div>*/}
                      <div className="upload-video" onClick={this.showModal}>
                        {!this.DRAFT_TOUR_DATA && !this.props.tourPhoto ? (
                          <div>
                            <div className="upload-multimedia-image">
                              <i className="fa fa-camera" />
                              Upload Photo
                            </div>
                          </div>
                        ) : (
                          <ReactImageFallback
                            src={
                              this.DRAFT_TOUR_DATA && !this.props.tourPhoto
                                ? this.setBackgoundImage(
                                    this.DRAFT_TOUR_DATA.tourId
                                  )
                                : this.props.tourPhoto.preview
                            }
                            fallbackImage={noImg}
                            alt="tour background"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <BottomNavigationPanel
                    infoString="You earn $4.82 each time this tour is purchased"
                    backHandler={path => this.goTo(path)}
                    path={'/tours'}
                    nextHandler={this.createOrUpdateTour}
                    disabled={!this.validateForm()}
                    btnName="next"
                  />
                </Col>
                <Col lg={6} md={6} sm={12} className="rigth-panel">
                  <section className="create-or-edit-tour-section">
                    <MapPanel />
                  </section>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
        <Modal show={this.state.showModal}>
          <UploadPhoto modalClosed={this.closeModalHandler} />
        </Modal>
        {/*<Footer />*/}
      </div>
    );
  }
}

TourCreateComponent.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  setEditedRouteId: PropTypes.func.isRequired,
  auth: PropTypes.instanceOf(Object).isRequired,
};

export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TourCreate)
);
