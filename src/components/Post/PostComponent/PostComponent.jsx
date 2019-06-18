import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Grid,
  Row,
  Col,
  Panel,
  Image,
  PageHeader,
  Badge,
  Glyphicon,
  Button,
} from 'react-bootstrap';
import ReactRouterPropTypes from 'react-router-prop-types';
import ApiService from '../../../services/ApiService/ApiService';
import PropertiesService from '../../../services/PropertiesService/PropertiesService';
import Carousel from '../../Carousel/Carousel';
import userImg from '../../../assets/img/user.jpg';
import {
  usersPath,
  propertyPath,
  propertiesPath,
  postsPath,
  attachmentsPath,
  companiesPath,
} from '../../../utils/paths';
import { selectRoutes, selectSingleRoute } from '../../../actions/routes';
import { setUserPostsProperties } from '../../../actions/mapActions';
import { setPosts } from '../../../actions/postActions';
import './PostComponent.css';

const Post = withRouter(props => <PostComponent {...props} />);

const mapStateToProps = state => ({
  posts: state.posts,
  postTypes: state.postTypes,
  selectedRoutesIds: state.routes.selectedRoutesIds,
  postProperties: state.map.userPage.postProperties,
});

const mapDispatchToProps = {
  selectRoutes,
  selectSingleRoute,
  setPosts,
  setUserPostsProperties,
};

class PostComponent extends Component {
  state = {
    user: {
      firstName: 'Loading...',
      lastName: '',
    },
    property: {
      name: 'Empty seed',
    },
    company: {
      name: 'Empty seed',
    },
    files: [],
    post_type: {},
  };

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(next) {
    if (
      this.props.userPost.user !== next.userPost.user &&
      this.props.userPost.user &&
      this.props.userPost.property &&
      this.props.userPost.company
    ) {
      this.setState({
        user: {
          firstName: this.props.userPost.user.first_name,
          lastName: this.props.userPost.user.last_name,
        },
        property: {
          name:
            this.props.userPost.property.property_info &&
            this.PropDataService.setPropertyByType(
              this.props.userPost.property,
              'address'
            ),
        },
        company: {
          name: this.props.userPost.company.name,
        },
      });
    }
  }

  getData = () => {
    if (this.props.userPost.user_id) {
      this.getUserData(`${usersPath}/${this.props.userPost.user_id}`)
        .then(res => {
          this.setState({
            user: {
              firstName: res.data.first_name,
              lastName: res.data.last_name,
            },
          });
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (this.props.userPost.property_id) {
      this.getPropertyData(
        `${propertiesPath}/${this.props.userPost.property_id}`
      )
        .then(res => {
          if (
            !this.checkExistingProperty(this.props.userPost.property_id) &&
            this.props.userPage
          ) {
            const props = this.props.postProperties.concat(res.data);
            this.props.setUserPostsProperties(props);
          }
          this.setState({
            property: {
              name:
                res.data &&
                res.data.property_info &&
                this.PropDataService.setPropertyByType(res.data, 'address'),
            },
          });
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (this.props.userPost.company_id) {
      this.getCompayData(`${companiesPath}/${this.props.userPost.company_id}`)
        .then(res => {
          this.setState({
            company: res.data.name,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }

    this.getAttachments(
      `${postsPath}/${this.props.userPost.id ||
        this.props.postId}${attachmentsPath}`
    ).then(res => {
      this.setState({
        files: (res && res.data) || [],
      });
    });

    if (this.props.userPost.post_type_id) {
      this.setPostTypes(this.props.postTypes);
    }
  };

  setPostTypes = data => {
    Array.isArray(data) &&
      data.forEach(item => {
        if (item.id === this.props.userPost.post_type_id) {
          this.setState({
            post_type: item,
          });
        }
      });
  };

  setSelectedPost = selectedPostId => {
    const changedPosts = this.props.posts.map(item => {
      if (item.id === selectedPostId) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    });
    this.props.setPosts(changedPosts);
  };

  getUserData = url => this.ApiService.getComponent(url);

  getPropertyData = url => this.ApiService.getComponent(url);

  getCompayData = url => this.ApiService.getComponent(url);

  getAttachments = url => this.ApiService.getComponent(url);

  setAsRouteStop = () => {
    this.props.selectSingleRoute({
      propertyId:
        this.props.userPost.property_id ||
        (this.props.userPost.property && this.props.userPost.property.id),
      postId: this.props.userPost.id,
      propertyName:
        (this.props.userPost.property &&
          this.PropDataService.setPropertyByType(
            this.props.userPost.property,
            'address'
          )) ||
        this.PropDataService.setPropertyByType(this.state.property, 'address'),
    });
    this.setSelectedPost(this.props.userPost.id);
  };

  checkExistingProperty = id => {
    const props = this.props.postProperties;
    const propsLen = this.props.postProperties.length;
    for (let i = 0; i < propsLen; i++) {
      if (props[i].id === id) {
        return true;
      }
    }
    return false;
  };

  goTo = () => {
    if (this.props.userPost.user) {
      this.props.history.push(`${usersPath}/${this.props.userPost.user.id}`);
    } else {
      this.props.userPost.user_id &&
        this.props.history.push(`${usersPath}/${this.props.userPost.user_id}`);
    }
  };

  goToProperty = () => {
    if (this.props.userPost.property) {
      this.props.history.push(
        `${propertyPath}/${this.props.userPost.property.id}`
      );
    } else {
      this.props.userPost.property_id &&
        this.props.history.push(
          `${propertyPath}/${this.props.userPost.property_id}`
        );
    }
  };

  ApiService = new ApiService();
  PropDataService = new PropertiesService();

  render() {
    const postDocument = this.props.userPost.post_document;
    const { userPost, isItRoutes } = this.props;
    return (
      <Panel
        className={`post-component ${userPost.selected ? 'selected' : ''}`}
      >
        <Panel.Heading>
          <Grid>
            <Row className="show-grid">
              <Col lg={2} md={2} sm={2} xs={2}>
                <Image
                  circle
                  responsive
                  className="user-img"
                  src={userImg}
                  onClick={this.goTo}
                />
              </Col>
              <Col lg={8} md={8} sm={8} xs={8}>
                <PageHeader>
                  <span onClick={this.goTo}>
                    {userPost.user
                      ? `${userPost.user.first_name} ${userPost.user.last_name}`
                      : `${this.state.user.firstName} ${
                          this.state.user.lastName
                        }`}
                  </span>
                  <br />
                  <small>Share a comment</small>
                  <div className="post-component-property-location">
                    <Glyphicon glyph="map-marker" className="map-marker" />
                    <span onClick={this.goToProperty}>
                      {userPost.property && userPost.property.property_info
                        ? `${this.PropDataService.setPropertyByType(
                            userPost.property,
                            'address'
                          )}`
                        : `${this.state.property.name}`}
                    </span>
                  </div>
                </PageHeader>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                <span className="post-type pull-right">
                  {(userPost.post_type && userPost.post_type.name) ||
                    this.state.post_type.name}
                </span>
                <Badge className="pull-right">
                  {moment(userPost.event_date).format('ll')}
                </Badge>
              </Col>
            </Row>
          </Grid>
        </Panel.Heading>
        <Panel.Body>
          <Carousel slides={this.state.files} />
          {userPost.content}
          <h4 className={`doc-info-header ${postDocument ? '' : 'hidden'}`}>
            DOC INFO
          </h4>
          <Grid>
            <Row
              className={`show-grid ${
                postDocument && postDocument.document_type_id === 1
                  ? ''
                  : 'hidden'
              }`}
            >
              <Col lg={4} md={4} sm={4} xs={4}>
                <strong>Author: {postDocument && postDocument.author}</strong>
              </Col>
            </Row>
            <Row
              className={`show-grid ${
                postDocument && postDocument.document_type_id === 2
                  ? ''
                  : 'hidden'
              }`}
            >
              <Col lg={4} md={4} sm={4} xs={4}>
                <strong>Author: {postDocument && postDocument.author}</strong>
              </Col>
            </Row>
          </Grid>
        </Panel.Body>
        <Panel.Footer>
          <Grid>
            <Row className="show-grid">
              <Col lg={4} md={4} sm={4} xs={4}>
                25 Comments
              </Col>
              <Col lg={3} md={3} sm={3} xs={3}>
                <Button
                  className={`${isItRoutes ? '' : 'hidden'}`}
                  onClick={this.setAsRouteStop}
                  disabled={userPost.selected}
                >
                  {`${userPost.selected ? 'Added' : 'Add as route stop'}`}
                </Button>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                Comment
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                Share
              </Col>
              <Col lg={1} md={1} sm={1} xs={1}>
                ...
              </Col>
            </Row>
          </Grid>
        </Panel.Footer>
      </Panel>
    );
  }
}

PostComponent.defaultProps = {
  userPost: null,
  postTypes: [],
  posts: [],
  postProperties: [],
  postId: null,
  isItRoutes: null,
  userPage: null,
};
PostComponent.propTypes = {
  userPost: PropTypes.instanceOf(Object),
  history: ReactRouterPropTypes.history.isRequired,
  postTypes: PropTypes.instanceOf(Array),
  postProperties: PropTypes.instanceOf(Array),
  posts: PropTypes.instanceOf(Array),
  setPosts: PropTypes.func.isRequired,
  setUserPostsProperties: PropTypes.func.isRequired,
  selectSingleRoute: PropTypes.func.isRequired,
  postId: PropTypes.string,
  isItRoutes: PropTypes.bool,
  userPage: PropTypes.bool,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post);
