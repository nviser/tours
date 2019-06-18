import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Header from '../Header/Header';
import './PaymentMethods.css';
import SidePanel from '../SidePanel/SidePanel';
import {
  getPaymentMethods as getPaymentMethodsUrl,
  createPaymentMethod,
} from '../../utils/paths';
import ApiService from '../../services/ApiService/ApiService';
import { setLoader } from '../../actions/loaderActions';
import { setPaymentMethods, setEditCard } from '../../actions/paymentMethods';
import PaymentCard from './PaymentCard/PaymentCard';
import AddPaymentMethod from './AddPaymentMethod/AddPaymentMethod';
import navItems from '../User/navItems';
import SidePanelMobile from '../SidePanelMobile/SidePanelMobile';
import HeaderMobile from '../HeaderMobile/HeaderMobile';

class PaymentMethods extends Component {
  componentDidMount = () => {
    this.getPaymentMethods();
  };
  Api = new ApiService();
  getPaymentMethods = () => {
    this.props.setLoader(true);
    this.Api.getPaymentMethods(getPaymentMethodsUrl)
      .then(result => {
        this.props.setLoader(false);
        this.setState({ cards: result.data });
        this.props.setPaymentMethods(result.data);
      })
      .catch(e => {
        this.props.setLoader(false);
      });
  };

  addPaymentHandler = () => {
    this.props.setEditCard(null);
    this.props.history.push(createPaymentMethod);
  };
  render() {
    let cards = [];
    if (this.props.cards.length) {
      cards = this.props.cards.map(card => (
        <PaymentCard key={card.id} card={card} />
      ));
    }
    return (
      <div className="payment-methods">
        <HeaderMobile />
        <Header />
        <div className="payment-methods-wrapper">
          <div className="payment-methods-container">
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
                <Col
                  lg={9}
                  md={8}
                  sm={8}
                  xs={12}
                  className="payment-methods-block"
                >
                  <section className="payment-methods-cards">
                    {cards}{' '}
                    <AddPaymentMethod
                      addPaymentHandler={this.addPaymentHandler}
                      isAdd={true}
                    />
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

const mapStateToProps = state => ({
  cards: state.paymentMethods.cards,
  userData: state.auth.userData,
});

const mapDispatchToProps = dispatch => ({
  setLoader: status => dispatch(setLoader(status)),
  setPaymentMethods: cards => dispatch(setPaymentMethods(cards)),
  setEditCard: card => dispatch(setEditCard(card)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentMethods);
