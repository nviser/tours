import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PostList from '../../components/Post/PostList/PostList';
import AddPost from '../../components/Post/AddPost/AddPost';
import UserData from '../../components/UserData/UserData';
import InfoPannel from '../../components/InfoPannel/InfoPannel';
import DateFilter from '../../components/DateFilter/DateFilter';
import ApiService from '../../services/ApiService/ApiService';
import { setPosts, setPostTypes } from '../../actions/postActions';
import { setUserData } from '../../actions/userActions';
import { setUserForEdit } from '../../actions/editAction';
import { setLoader } from '../../actions/loaderActions';
import { setUserPostsProperties } from '../../actions/mapActions';
import {
  usersPath,
  postsPath,
  postTypesPath,
  searchUserNotFoundPath,
} from '../../utils/paths';
import './UserPage.css';

const UserPageComponent = withRouter(props => <UserPage {...props} />);

const mapStateToProps = state => ({
  posts: state.posts,
  user_data: state.user,
  postTypes: state.postTypes,
  postProperties: state.map.userPage.postProperties,
});

const mapDispatchToProps = {
  setUserData,
  setUserForEdit,
  setPosts,
  setLoader,
  setPostTypes,
  setUserPostsProperties,
};

class UserPage extends Component {
  componentDidMount() {
    this.getPostTypes();
    if (this.props.match.params.id !== this.props.user_data.id) {
      this.setUserData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id)
      this.props.setUserPostsProperties([]);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id)
      this.setUserData();
  }

  componentWillUnmount() {
    this.props.setPosts([]);
    this.props.setUserPostsProperties([]);
  }

  setUserData = () => {
    if (Number(this.props.match.params.id)) {
      this.props.setLoader(true);
      Promise.all([
        this.getUserData(`${usersPath}/${this.props.match.params.id}`),
        this.getUserPosts(`${usersPath}/${this.props.match.params.id}/posts`),
      ])
        .then(values => {
          this.props.setUserData(values[0].data);
          this.props.setUserForEdit(values[0].data);
          this.props.setPosts(values[1].data);
          window.scrollTo(0, 0);
          this.props.setLoader(false);
        })
        .catch(err => {
          this.props.setLoader(false);
          if (err && err.response && err.response.data.errors) {
            this.props.history.push(searchUserNotFoundPath);
          }
        });
    }
  };

  getPostTypes = () => {
    if (this.props.postTypes && !this.props.postTypes.length) {
      this.ApiService.getComponent(`${postsPath}${postTypesPath}`).then(res => {
        this.props.setPostTypes(res.data);
      });
    }
  };

  getUserData = url => this.ApiService.getComponent(url);

  getUserPosts = url => this.ApiService.getComponentPosts(url);

  ApiService = new ApiService();

  render() {
    return (
      <div className="home-logged">
        <Header />
        <div className="logged-wrap">
          <Grid>
            <Row className="show-grid">
              <Col lg={7} md={7} sm={7} xs={7}>
                <UserData />
                <DateFilter />
                <AddPost userPage />
                <PostList posts={this.props.posts} userPage />
              </Col>
              <Col lg={5} md={5} sm={5} xs={5} className="logged-right-panel">
                <InfoPannel
                  data={this.props.user_data}
                  title="about you"
                  text={this.props.user_data.summary}
                  userPage
                />
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

UserPage.defaultProps = {
  posts: null,
  user_data: null,
  postTypes: [],
};
UserPage.propTypes = {
  posts: PropTypes.instanceOf(Array),
  user_data: PropTypes.instanceOf(Object),
  setUserData: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  setPosts: PropTypes.func.isRequired,
  setUserPostsProperties: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  postTypes: PropTypes.instanceOf(Array),
  setPostTypes: PropTypes.func.isRequired,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPageComponent);
