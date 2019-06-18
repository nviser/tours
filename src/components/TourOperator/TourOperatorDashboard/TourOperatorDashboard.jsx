import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './TourOperatorDashboard.css';
import Header from '../../Header/Header';
import { withRouter, Link } from 'react-router-dom';
import withAuth from '../../../services/withAuth/withAuth';
import { connect } from 'react-redux';
import ApiService from '../../../services/ApiService/ApiService';
import { Grid, Row, Col } from 'react-bootstrap';
import { setLoader } from '../../../actions/loaderActions';
import { setUserActive } from '../../../actions/authAction';
import {
  toursSalesApiPath,
  payOutsApiPath,
  payOutsCompanyApiPath,
  salesHistory,
  payouts,
} from '../../../utils/paths';
import TableNoBordered from '../../UI/Table/TableNoBorded/TableNoBordered';
import TableNoBorderedPayouts from '../../UI/Table/TableNoBorded/TableNoBorderedPayouts';
import { navItems } from '../navItemsInit';
import DashboardGreeting from '../../DashboardGreeting/DashboardGreeting';
import { tourInfoPath } from '../../../utils/paths';
import SidePanel from '../../SidePanel/SidePanel';
import SidePanelMobile from '../../SidePanelMobile/SidePanelMobile';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
  avatar: state.auth.avatar,
  company: state.auth.userData.staff,
});

const mapDispatchToProps = {
  setLoader,
  setUserActive,
};

class TourOperatorDashboard extends Component {
  state = {
    sales: [],
    payouts: [],
    isWelcomeMerchantShown: false,
  };

  greetingOptions = {
    message: `Share your knowledge with the world. Create the tours you know, publish them, and start earn-ing today.`,
    buttonTitle: 'Create new tour',
  };

  componentDidMount() {
    this.setState({
      isWelcomeMerchantShown: localStorage.getItem('isWelcomeMerchantShown'),
    });
    if (
      this.props.company === null ||
      (this.props.company && Object.values(this.props.company).length > 0)
    )
      this.getAllData();
    this.props.setUserActive(false);
  }

  isCompanyChecker = () => {
    if (this.props.company && Object.values(this.props.company).length > 0) {
      return payOutsCompanyApiPath;
    }
    return payOutsApiPath;
  };
  closeWelcomeMessage = () => {
    const isShown = true;
    localStorage.setItem('isWelcomeMerchantShown', isShown);
    this.setState({ isWelcomeMerchantShown: isShown });
  };

  createTour = () => {
    this.props.history.push(tourInfoPath);
  };

  getAllData = () => {
    this.props.setLoader(true);
    Promise.all([this.getSales(), this.getPayOuts()])
      .then(values => {
        if (values[0].data) {
          this.setState({
            sales: values[0].data,
          });
        }
        if (values[1].data) {
          this.setState({
            payouts: values[1].data.payouts.slice(0, 5),
          });
        }
        this.props.setLoader(false);
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };

  goTo = path => {
    this.props.history.push(path);
  };

  getSales = () =>
    this.Api.getComponent(`${toursSalesApiPath}?limit=5&offset=0`);

  getPayOuts = () =>
    this.Api.getComponent(`${this.isCompanyChecker()}?limit=5&offset=0`);

  Api = new ApiService();

  render() {
    if (this.props.userData.role === 1) {
      return <Redirect to="/not_found_page" />;
    }
    return (
      <div className="board-page">
        <div className="board-page-wrap">
          <HeaderMobile />
          <Header />
          <div className="board-page-container">
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
                      {!this.state.isWelcomeMerchantShown && (
                        <Col lg={12}>
                          <DashboardGreeting
                            cancelHandler={this.closeWelcomeMessage}
                            clickHandler={this.createTour}
                            options={this.greetingOptions}
                          />
                        </Col>
                      )}
                    </Row>
                    <Row className="show-grid">
                      <Col lg={12}>
                        <div className="tour-operator-content">
                          <div className="tour-operator-content-title">
                            <h2 className="regular-header">Resent Sales</h2>
                            <Link to={salesHistory}>View More</Link>
                          </div>
                          {this.state.sales.length ? (
                            <TableNoBordered sales={this.state.sales} />
                          ) : (
                            <h4>Your sales history is empty.</h4>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row className="show-grid--margin-top">
                      <Col lg={12}>
                        <div className="tour-operator-content">
                          <div className="tour-operator-content-title">
                            <h2 className="regular-header">Recent Payouts</h2>
                            <Link to={payouts}>View More</Link>
                          </div>
                          {this.state.payouts.length ? (
                            <TableNoBorderedPayouts
                              payouts={this.state.payouts}
                            />
                          ) : (
                            <h4>Your payout history is empty.</h4>
                          )}
                        </div>
                      </Col>
                    </Row>
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
export default withAuth(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(TourOperatorDashboard)
  )
);
