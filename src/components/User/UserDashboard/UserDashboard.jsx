import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setLoader } from '../../../actions/loaderActions';
import Header from '../../../components/Header/Header';
//import Footer from '../../../components/Footer/Footer';
import SidePanel from '../../SidePanel/SidePanel';
import navItems from '../navItems';
import './UserDashboard.css';
import withAuth from '../../../services/withAuth/withAuth';
import DashboardPurchased from './DashboardPurchased/DashboardPurchased';
import DashboardJournal from './DashboardJournal/DashboardJournal';
import DashboardPaymentMethods from './DashboardPaymentMethods/DashboardPaymentMethods';
import DashboardGreeting from '../../DashboardGreeting/DashboardGreeting';
import { searchQueryPath } from '../../../../src/utils/paths';
import { setUserActive } from '../../../actions/authAction';
import SearchService from '../../../services/SearchService/SearchService';
import { GET_IP_API, GET_LOCATION_API } from '../../../utils/const';
import SidePanelMobile from '../../SidePanelMobile/SidePanelMobile';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';
const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = {
  setLoader,
  setUserActive,
};

const UserDashboard = withRouter(props => (
  <UserDashboardComponent {...props} />
));

class UserDashboardComponent extends Component {
  componentDidMount() {
    this.props.setUserActive(true);
  }

  Search = new SearchService();

  getLocation = pos => {
    const country = pos.country_name,
      city = pos.city;
    this.props.history.push(`${searchQueryPath}${city},%20${country}`);
  };

  state = {
    welcomeMsg: true,
  };

  greetingOptions = {
    message:
      'Here you can edit your profile, see all your trips and manage your payment methods.',
    buttonTitle: 'View tours',
  };
  cancelHandler = () => {
    localStorage.setItem('welcome', true);
    this.setState({ welcomeMsg: false });
  };
  viewToursHandler = () => {
    this.props.setLoader(true);
    this.Search.getLocation(GET_IP_API)
      .then(res => {
        this.Search.getLocation(GET_LOCATION_API(res.data.ip))
          .then(res => {
            this.props.setLoader(false);
            this.getLocation(res.data);
          })
          .catch(err => {
            this.props.setLoader(false);
          });
      })
      .catch(err => {
        this.props.setLoader(false);
      });
  };
  render() {
    const welcome = localStorage.getItem('welcome');
    return (
      <div className="board-page">
        <div className="board-page-wrap">
          <HeaderMobile />
          <Header />
          <div className="board-page-container dashboard">
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
                  <section className="board-section">
                    <Row className="show-grid">
                      {this.state.welcomeMsg && !welcome && (
                        <Col lg={12}>
                          <DashboardGreeting
                            cancelHandler={this.cancelHandler}
                            clickHandler={this.viewToursHandler}
                            options={this.greetingOptions}
                          />
                        </Col>
                      )}
                      <Col lg={12}>
                        <DashboardPurchased />
                      </Col>
                    </Row>
                    <div className="board-container">
                      <Row className="show-grid">
                        <Col lg={7}>
                          <DashboardJournal />
                        </Col>
                        <Col lg={5}>
                          <DashboardPaymentMethods />
                        </Col>
                      </Row>
                    </div>
                  </section>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
        {/*<Footer />*/}
      </div>
    );
  }
}

export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserDashboard)
);
