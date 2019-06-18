import React, { Component } from 'react';
import './TourOperatorSalesHistory.css';
import moment from 'moment';
import Header from '../../Header/Header';
import { connect } from 'react-redux';
import ApiService from '../../../services/ApiService/ApiService';
import DatePicker from 'react-date-picker';
import { setLoader } from '../../../actions/loaderActions';
import {
  toursSalesApiPath,
  toursSalesStatsApiPath,
} from '../../../utils/paths';
import { Grid, Row, Col } from 'react-bootstrap';
import TableNoBordered from '../../UI/Table/TableNoBorded/TableNoBordered';
import tourCreatedImg from '../../../assets/img/created_tour.svg';
import tourTakenImg from '../../../assets/img/taken_tour.svg';
import rewiewsImg from '../../../assets/img/tour_review.svg';
import calendarImg from '../../../assets/img/calendar.png';
import { navItems } from '../navItemsInit';
import SidePanelMobile from '../../SidePanelMobile/SidePanelMobile';
import SidePanel from '../../SidePanel/SidePanel';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const mapDispatchToProps = {
  setLoader,
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
});

class TourOperatorSalesHistory extends Component {
  state = {
    dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)), //date month ago from today
    dateTo: new Date(),
    sales: [],
    stats: {},
    status: 'all',
  };

  componentWillMount() {
    if (!this.props.userData.role) {
      this.props.history.replace('/');
    }
    if (this.props.userData.role === 1) {
      this.props.history.replace('/page_not_found_for_role_1');
    }
  }

  componentDidMount() {
    this.getSales();
    this.getSaleStats();
  }

  getSales = () => {
    this.props.setLoader(true);
    this.Api.getComponent(
      `${toursSalesApiPath}?start_date=${moment(this.state.dateFrom).format(
        'YYYY/MM/D'
      )}&end_date=${moment(this.state.dateTo).format('YYYY/MM/D')}&status=${
        this.state.status
      }`
    )
      .then(res => {
        this.props.setLoader(false);
        this.setState({
          sales: res.data,
        });
      })
      .catch(err => {
        this.props.setLoader(false);
      });
  };

  getSaleStats = () => {
    this.props.setLoader(true);
    this.Api.getComponent(toursSalesStatsApiPath)
      .then(res => {
        this.props.setLoader(false);
        this.setState({
          stats: res.data,
        });
      })
      .catch(err => {
        this.props.setLoader(false);
      });
  };

  clearFilters = () => {
    this.setState(
      {
        dateFrom: new Date(),
        dateTo: new Date(),
        status: 'all',
        statusOptions: [],
      },
      () => this.getSales()
    );
  };

  setDateFrom = dateFrom => {
    this.setState({ dateFrom }, () => this.getSales());
  };

  setDateTo = dateTo => {
    this.setState({ dateTo }, () => this.getSales());
  };

  onChange = value => {
    this.setState(
      {
        status: value,
      },
      () => this.getSales()
    );
  };

  Api = new ApiService();
  render() {
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
                    <Row className="creator-panel no-margin">
                      <Col
                        lg={3}
                        md={6}
                        sm={6}
                        xs={12}
                        className="no-padding margin-right filter"
                      >
                        <label className="date-filter" htmlFor="dateFrom">
                          From Date
                        </label>
                        <DatePicker
                          value={this.state.dateFrom}
                          onChange={this.setDateFrom}
                          calendarIcon={
                            <img src={calendarImg} alt="calendar" />
                          }
                          clearIcon={null}
                          className="picker-start-date"
                          id="dateFrom"
                        />
                      </Col>
                      <Col
                        lg={3}
                        md={6}
                        sm={6}
                        xs={12}
                        className="no-padding margin-right filter"
                      >
                        <label className="date-filter" htmlFor="dateFrom">
                          To Date
                        </label>
                        <DatePicker
                          value={this.state.dateTo}
                          onChange={this.setDateTo}
                          calendarIcon={
                            <img src={calendarImg} alt="calendar" />
                          }
                          clearIcon={null}
                          className="picker-end-date"
                          id="dateTo"
                        />
                      </Col>
                      <Col
                        lg={3}
                        md={6}
                        sm={6}
                        xs={12}
                        className="clear-btn no-padding filter"
                      >
                        <div
                          className="creator-panel-btn-clear"
                          onClick={this.clearFilters}
                        >
                          CLEAR
                        </div>
                      </Col>
                    </Row>
                    <div className="tour-operator-content statistic show-grid--margin-top">
                      <div className="tour-operator-statistic">
                        <Row className="show-grid no-margin">
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            className="payout-icon"
                          >
                            <div>
                              <img
                                className="tour-operator-statistic-img"
                                src={tourCreatedImg}
                                alt=""
                              />
                            </div>
                            <div className="tour-operator-statistic-item-title">
                              <div className="tour-operator-statistic-item-label">
                                Tours Created
                              </div>
                              <div className="tour-operator-statistic-item-count_tours">
                                <div className="tour-operator-statistic-item-count">
                                  {this.state.stats.created}
                                </div>
                                <div className="tour-operator-statistic-item-tours">
                                  Tours
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            className="payout-icon"
                          >
                            <div>
                              <img
                                className="tour-operator-statistic-img"
                                src={tourTakenImg}
                                alt=""
                              />
                            </div>
                            <div className="tour-operator-statistic-item-title">
                              <div className="tour-operator-statistic-item-label">
                                Tours Taken
                              </div>
                              <div className="tour-operator-statistic-item-count_tours">
                                <div className="tour-operator-statistic-item-count">
                                  {this.state.stats.taken}
                                </div>
                                <div className="tour-operator-statistic-item-tours">
                                  Tours
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            className="payout-icon"
                          >
                            <div className="tour-operator-statistic-img">
                              <img src={rewiewsImg} alt="" />
                            </div>
                            <div className="tour-operator-statistic-item-title">
                              <div className="tour-operator-statistic-item-label">
                                Reviews
                              </div>
                              <div className="tour-operator-statistic-item-count_tours">
                                <div className="tour-operator-statistic-item-count">
                                  {this.state.stats.reviews}
                                </div>
                                <div className="tour-operator-statistic-item-tours">
                                  Reviews
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                    <div className="tour-operator-content show-grid--margin-top">
                      <h2 className="content-header regular-header">
                        Sales History
                      </h2>
                      {this.state.sales.length ? (
                        <TableNoBordered sales={this.state.sales} />
                      ) : (
                        <h4>Your sales history is empty.</h4>
                      )}
                    </div>
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
)(TourOperatorSalesHistory);
