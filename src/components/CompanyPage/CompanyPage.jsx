import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PostList from '../../components/Post/PostList/PostList';
import AddPost from '../../components/Post/AddPost/AddPost';
import CompanyData from '../../components/CompanyData/CompanyData';
import InfoPannel from '../../components/InfoPannel/InfoPannel';
import DateFilter from '../../components/DateFilter/DateFilter';
import ApiService from '../../services/ApiService/ApiService';
import { setPosts, setPostTypes } from '../../actions/postActions';
import { setCompanyData } from '../../actions/companyActions';
import { setLoader } from '../../actions/loaderActions';
import {
  companiesPath,
  searchCompanyNotFoundPath,
  postsPath,
  postTypesPath,
} from '../../utils/paths';
import HeaderMobile from '../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  posts: state.posts,
  company_data: state.company,
  postTypes: state.postTypes,
});

const mapDispatchToProps = {
  setCompanyData,
  setPosts,
  setLoader,
  setPostTypes,
};

const CompanyPageComponent = withRouter(props => <CompanyPage {...props} />);

class CompanyPage extends Component {
  componentDidMount() {
    this.getPostTypes();
    if (this.props.match.params.id !== this.props.company_data.id) {
      this.getData();
    }
  }

  getData = () => {
    if (Number(this.props.match.params.id)) {
      this.props.setLoader(true);
      Promise.all([
        this.getCompanyData(`${companiesPath}/${this.props.match.params.id}`),
        this.getCompanyPosts(
          `${companiesPath}/${this.props.match.params.id}/posts`
        ),
      ])
        .then(values => {
          this.props.setCompanyData(values[0].data);
          this.props.setPosts(values[1].data);
          window.scrollTo(0, 0);
          this.props.setLoader(false);
        })
        .catch(err => {
          if (err && err.response && err.response.data.errors) {
            this.props.history.push(searchCompanyNotFoundPath);
          }
          this.props.setLoader(false);
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

  getCompanyData = url => this.ApiService.getComponent(url);

  getCompanyPosts = url => this.ApiService.getComponentPosts(url);

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
                <CompanyData />
                <DateFilter />
                <AddPost />
                <PostList posts={this.props.posts} />
              </Col>
              <Col lg={5} md={5} sm={5} xs={5} className="logged-right-panel">
                <InfoPannel
                  data={this.props.company_data}
                  title="summary"
                  text={this.props.company_data.summary}
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

CompanyPage.defaultProps = {
  posts: null,
  company_data: null,
  postTypes: [],
};
CompanyPage.propTypes = {
  posts: PropTypes.instanceOf(Array),
  company_data: PropTypes.instanceOf(Object),
  setCompanyData: PropTypes.func.isRequired,
  setPosts: PropTypes.func.isRequired,
  setLoader: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  postTypes: PropTypes.instanceOf(Array),
  setPostTypes: PropTypes.func.isRequired,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyPageComponent);
