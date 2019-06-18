import React, { Component } from 'react';
import Header from '../Header/Header';
import { Grid, Row, Col } from 'react-bootstrap';
import './MerchantAccount.css';
import { payoutAccount } from '../../utils/paths';
import { connect } from 'react-redux';
import { setLoader } from '../../actions/loaderActions';
import ApiService from '../../services/ApiService/ApiService';
import { navItems } from '../TourOperator/navItemsInit';
import SidePanelMobile from '../SidePanelMobile/SidePanelMobile';
import SidePanel from '../SidePanel/SidePanel';
import HeaderMobile from '../HeaderMobile/HeaderMobile';

const mapStateToProps = state => {
  return {
    userData: state.auth.userData,
  };
};

const mapDispatchToProps = {
  setLoader,
};

class MerchantAccount extends Component {
  state = {
    message: 'Redirecting to stripe account...',
  };

  componentWillMount() {
    this.getPayoutData();
  }

  Api = new ApiService();
  getPayoutData = () => {
    this.props.setLoader(true);
    this.Api.getComponent(payoutAccount)
      .then(response => {
        window.open(response.data, '_self');
      })
      .catch(e => {
        this.props.setLoader(false);
        this.setState({
          message:
            'Connection failed. Please contact support center for more information',
        });
      });
  };

  render() {
    return (
      <div className="board-page">
        <HeaderMobile />
        <Header />
        <div className="board-page-wrap merchant-page">
          <div className="board-page-container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid no-margin">
                <Col lg={3} md={3} sm={12}>
                  <SidePanelMobile
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                  <SidePanel
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                </Col>
                <Col lg={9} md={9} sm={12}>
                  <div className="merchant-account">
                    <div className="merchant-account-container business-info">
                      <h1 className="merchant-redirect">
                        {this.state.message}
                      </h1>
                    </div>
                  </div>
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
)(MerchantAccount);
