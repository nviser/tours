import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PostList from '../../components/Post/PostList/PostList';
import AddPost from '../../components/Post/AddPost/AddPost';
import PropertyData from '../../components/PropertyData/PropertyData';
import InfoPannel from '../../components/InfoPannel/InfoPannel';
import DateFilter from '../../components/DateFilter/DateFilter';
import ApiService from '../../services/ApiService/ApiService';
import { setPosts, setPostTypes } from '../../actions/postActions';
import { setPropertyData } from '../../actions/propertyActions';
import { setLoader } from '../../actions/loaderActions';
import { setMapCenter } from '../../actions/mapActions';
import {
  propertiesPath,
  searchPropertyNotFoundPath,
  postsPath,
  postTypesPath,
} from '../../utils/paths';
import HeaderMobile from '../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  posts: state.posts,
  property_data: state.property,
  postTypes: state.postTypes,
});

const mapDispatchToProps = {
  setPropertyData,
  setPosts,
  setLoader,
  setPostTypes,
  setMapCenter,
};

const PropertyPageComponent = withRouter(props => <PropertyPage {...props} />);

class PropertyPage extends Component {
  componentDidMount() {
    this.getPostTypes();
    if (this.props.match.params.id !== this.props.property_data.id) {
      this.getData();
    }
  }

  getData = () => {
    this.props.setLoader(true);
    Promise.all([
      this.getPropertyData(`${propertiesPath}/${this.props.match.params.id}`),
      this.getPropertyPosts(
        `${propertiesPath}/${this.props.match.params.id}/posts`
      ),
    ])
      .then(values => {
        this.props.setPropertyData(values[0].data);
        this.props.setPosts(values[1].data);
        this.props.setMapCenter({
          lat: this.props.property_data.geo_location.geometry.coordinates[0],
          lng: this.props.property_data.geo_location.geometry.coordinates[1],
          zoom: 16,
        });
        window.scrollTo(0, 0);
        this.props.setLoader(false);
      })
      .catch(err => {
        this.props.setLoader(false);
        if (err && err.response && err.response.data.errors) {
          this.props.history.push(searchPropertyNotFoundPath);
        }
      });
  };

  getPostTypes = () => {
    if (this.props.postTypes && !this.props.postTypes.length) {
      this.ApiService.getComponent(`${postsPath}${postTypesPath}`).then(res => {
        this.props.setPostTypes(res.data);
      });
    }
  };

  getPropertyData = url => this.ApiService.getComponentPosts(url);

  getPropertyPosts = url => this.ApiService.getComponentPosts(url);

  ApiService = new ApiService();

  render() {
    return (
      <div className="home-logged">
        <HeaderMobile />
        <Header />
        <div className="logged-wrap">
          <Grid>
            <Row className="show-grid">
              <Col lg={7} md={7} sm={7} xs={7}>
                <PropertyData property_data={this.props.property_data} />
                <DateFilter />
                <AddPost urlData={this.props.match} itIsProperty />
                <PostList posts={this.props.posts} />
              </Col>
              <Col lg={5} md={5} sm={5} xs={5} className="logged-right-panel">
                <InfoPannel data={this.props.property_data} itIsProperty />
              </Col>
            </Row>
          </Grid>
          <div className="logged-empty" />
        </div>
        <Footer />
      </div>
    );
  }
}
PropertyPage.defaultProps = {
  postTypes: [],
  property_data: null,
  posts: [],
};
PropertyPage.propTypes = {
  setPropertyData: PropTypes.func.isRequired,
  setPosts: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  setMapCenter: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  postTypes: PropTypes.instanceOf(Array),
  posts: PropTypes.instanceOf(Array),
  property_data: PropTypes.instanceOf(Object),
  setPostTypes: PropTypes.func.isRequired,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyPageComponent);
