import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../../Header/Header';
import moment from 'moment';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import ernedMoney from '../../../assets/img/erned_money.svg';
import money_paid from '../../../assets/img/money_paid.svg';
import money_owned from '../../../assets/img/money_owed.svg';
import TableNoBorderedPayouts from '../../UI/Table/TableNoBorded/TableNoBorderedPayouts';
import { navItems } from '../navItemsInit';
import DatePicker from 'react-date-picker';
import ApiService from '../../../services/ApiService/ApiService';
import calendarImg from '../../../assets/img/calendar.png';
import withAuth from '../../../services/withAuth/withAuth';
import { setLoader } from '../../../actions/loaderActions';
import { payOutsApiPath, payOutsCompanyApiPath } from '../../../utils/paths';
import './TourOperatorPayouts.css';
import SidePanelMobile from '../../SidePanelMobile/SidePanelMobile';
import SidePanel from '../../SidePanel/SidePanel';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const mapDispatchToProps = {
  setLoader,
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  company: state.auth.userData.staff,
});

const selectOptions = [
  { id: 1, title: 'paid' },
  { id: 2, title: 'pending' },
  { id: 3, title: 'failed' },
  { id: 4, title: 'canceled' },
];

class TourOperatorPayouts extends Component {
  state = {
    dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)), //date month ago from today
    dateTo: new Date(),
    status: 'all',
    statusOptions: selectOptions,
    data: {},
  };

  componentDidMount() {
    if (
      this.props.company === null ||
      (this.props.company && Object.values(this.props.company).length > 0)
    )
      this.getPayOuts();
  }

  isCompanyChecker = () => {
    if (this.props.company && Object.values(this.props.company).length > 0) {
      return payOutsCompanyApiPath;
    }
    return payOutsApiPath;
  };

  getPayOuts = () => {
    this.props.setLoader(true);
    this.Api.getComponent(
      `${this.isCompanyChecker()}?start_date=${moment(
        this.state.dateFrom
      ).format('YYYY/MM/D')}&end_date=${moment(this.state.dateTo).format(
        'YYYY/MM/D'
      )}&status=${this.state.status}`
    )
      .then(res => {
        this.props.setLoader(false);
        this.setState({
          data: res.data,
          statusOptions: selectOptions,
        });
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };

  Api = new ApiService();

  clearFilters = () => {
    this.setState(
      {
        dateFrom: new Date(),
        dateTo: new Date(),
        status: 'all',
        statusOptions: [],
      },
      () => this.getPayOuts()
    );
  };

  setDateFrom = dateFrom => {
    this.setState({ dateFrom }, () => this.getPayOuts());
  };

  setDateTo = dateTo => {
    this.setState({ dateTo }, () => this.getPayOuts());
  };

  onChange = value => {
    this.setState(
      {
        status: value,
      },
      () => this.getPayOuts()
    );
  };

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
                    {/*<div className="tour-operator-content-title">
                            <Link handleClick={window.print} title="Print Payouts" iconClass="fa fa-print" />
                        </div>*/}
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
                      {/*<Col lg={3} md={6} sm={6} xs={12} className="no-padding margin-right">
                                <Select
                                    selectId="statusFilter"
                                    selectValue={this.state.status}
                                    label="FILTER"
                                    options={this.state.statusOptions}
                                    onChange={this.onChange}
                                    wrapperClass="status-select"
                                    fieldToShow="title"
                                    fieldToSend="title"
                                    placeHolder="SELECT FILTER"
                                />
                            </Col>*/}
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
                    <Row className="show-grid">
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <div className="tour-operator-content statistic">
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
                                    src={ernedMoney}
                                    alt=""
                                  />
                                </div>
                                <div className="tour-operator-statistic-item-title">
                                  <div className="tour-operator-statistic-item-label">
                                    Erned Money
                                  </div>
                                  <div className="tour-operator-statistic-item-count_tours">
                                    <div className="tour-operator-statistic-item-count">
                                      ${this.state.data.earned_money}
                                    </div>
                                    <div className="tour-operator-statistic-item-tours">
                                      USD
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
                                    src={money_paid}
                                    alt=""
                                  />
                                </div>
                                <div className="tour-operator-statistic-item-title">
                                  <div className="tour-operator-statistic-item-label">
                                    Money Paid
                                  </div>
                                  <div className="tour-operator-statistic-item-count_tours">
                                    <div className="tour-operator-statistic-item-count">
                                      ${this.state.data.money_paid}
                                    </div>
                                    <div className="tour-operator-statistic-item-tours">
                                      USD
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
                                    src={money_owned}
                                    alt=""
                                  />
                                </div>
                                <div className="tour-operator-statistic-item-title">
                                  <div className="tour-operator-statistic-item-label">
                                    Money Owned
                                  </div>
                                  <div className="tour-operator-statistic-item-count_tours">
                                    <div className="tour-operator-statistic-item-count">
                                      ${this.state.data.money_owed}
                                    </div>
                                    <div className="tour-operator-statistic-item-tours">
                                      USD
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="show-grid--margin-top">
                      <Col lg={12}>
                        <div className="tour-operator-content">
                          <h2 className="content-header regular-header">
                            Payouts
                          </h2>
                          {this.state.data.payouts &&
                          this.state.data.payouts.length ? (
                            <TableNoBorderedPayouts
                              payouts={this.state.data.payouts}
                            />
                          ) : (
                            <h4>You payout history is empty</h4>
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TourOperatorPayouts)
);
