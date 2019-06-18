import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setLoader } from '../../../actions/loaderActions';
import { routesApiPath, searchPath } from '../../../utils/paths';
import Header from '../../../components/Header/Header';
import TourBottom from './TourBottom/TourBottom';
import ApiService from '../../../services/ApiService/ApiService';
import SearchService from '../../../services/SearchService/SearchService';
import withAuth from '../../../services/withAuth/withAuth';
import TourItem from '../../TourItem/TourItem';
import NotItems from '../UserDashboard/DashboardPurchased/NotItems/NotItems';
import { navItems } from '../../TourOperator/navItemsInit';
import './UserTours.css';
import { setPosts } from '../../../actions/postActions';
import { setEditedRouteId, setTourEditable } from '../../../actions/routes';
import { resetMapData } from '../../../actions/mapActions';
import { setTourImageWidth } from '../../../actions/tours';
import Pager from '../../Pager/Pager';
import notoursImg from '../../../assets/img/no-tours.jpg';
import SidePanelMobile from '../../SidePanelMobile/SidePanelMobile';
import SidePanel from '../../SidePanel/SidePanel';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const DESCRIPTION =
  'No favorites here yet! Search and save your next adventures';

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
  tourImageWidth: state.tours.tourImageWidth,
});

const mapDispatchToProps = {
  setLoader,
  resetMapData,
  setPosts,
  setEditedRouteId,
  setTourEditable,
  setTourImageWidth,
};

const UserTours = withRouter(props => <UserToursComponent {...props} />);

class UserToursComponent extends Component {
  state = {
    routes: [],
    status: '',
    width: 400,
    activePage: 1,
    itemsPerPage: 9,
    totalItems: 0,
    pageRange: 5,
    pages: null,
  };

  componentWillMount() {
    if (!this.props.userData.role) {
      this.props.history.replace('/');
    }
    if (this.props.userData.role === 1) {
      this.props.history.replace('/page_not_found_for_role_1');
    }
  }

  componentWillReceiveProps(next) {
    if (next.userData && next.userData.id) {
      this.getRoutes();
    }
  }
  componentWillUnmount = () => {
    this.setState({ routes: [] });
  };
  componentDidMount() {
    this.setWidth();
  }

  setWidth = () => {
    this.props.setTourImageWidth(this.props.tourImageWidth + 1);
  };

  getRoutes = () => {
    if (this.props.userData.id) {
      this.props.setLoader(true);
      this.ApiService.getComponent(
        `${routesApiPath}?user_id=${this.props.userData.id}&limit=${
          this.state.itemsPerPage
        }&offset=${0}`
      )
        .then(res => {
          this.setState(
            {
              routes: res.data,
              totalItems: res.headers.items_count,
              pages: res.headers.pages,
            },
            () => {
              if (!this.state.routes.length) {
                this.setState({
                  status: 'No tours',
                });
              }
            }
          );
          this.props.setLoader(false);
        })
        .catch(() => {
          this.props.setLoader(false);
          this.setState({
            status: 'No tours',
          });
        });
    }
  };

  goToMap = () => {
    this.props.history.push(searchPath);
  };

  handlePageChange = e => {
    const itemsSkip = this.state.itemsPerPage * e - this.state.itemsPerPage;
    this.props.setLoader(true);
    this.ApiService.getComponent(
      `${routesApiPath}?user_id=${this.props.userData.id}&limit=${
        this.state.itemsPerPage
      }&offset=${itemsSkip}`
    )
      .then(res => {
        this.setState({
          routes: res.data,
          activePage: e,
        });
        this.props.setLoader(false);
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };

  ApiService = new ApiService();
  Search = new SearchService();

  render() {
    return (
      <div className="tours-page">
        <div className="tours-wrap">
          <HeaderMobile />
          <Header />
          <div className="tours-container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid no-margin">
                <Col lg={3} md={4} sm={4} xs={12}>
                  <SidePanelMobile
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                  <SidePanel
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                </Col>
                <Col lg={9} md={8} sm={8} xs={12}>
                  <section className="tours-section">
                    <div className="tours-block">
                      {this.state.routes &&
                        this.state.routes.map(item => {
                          if (item.location) {
                            return (
                              <TourItem key={item.id} route={item}>
                                <TourBottom route={item} />
                              </TourItem>
                            );
                          }
                          return null;
                        })}
                    </div>
                    {!!this.state.status && (
                      <div
                        className={`${
                          this.state.routes.length ? 'hidden' : ''
                        } no-data`}
                      >
                        <div className="no-tours-container">
                          <NotItems
                            img={notoursImg}
                            description={DESCRIPTION}
                            clickHandler={this.goToMap}
                            btnTitle="Go to map"
                            clName="dpurchased"
                          />
                        </div>
                      </div>
                    )}
                    {this.state.routes.length > 0 && +this.state.pages > 1 && (
                      <div className="pagination">
                        <Pager
                          activePage={this.state.activePage}
                          itemsPerPage={this.state.itemsPerPage}
                          totalItems={this.state.totalItems}
                          pageRange={this.state.pageRange}
                          pages={this.state.pages}
                          handlePageChange={e => this.handlePageChange(e)}
                        />
                      </div>
                    )}
                  </section>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
        {/* <Footer />*/}
      </div>
    );
  }
}

UserToursComponent.defaultProps = {
  userData: null,
};

UserToursComponent.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  userData: PropTypes.instanceOf(Object),
  auth: PropTypes.instanceOf(Object).isRequired,
};

export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserTours)
);
