import React, { Component } from 'react';
import ApiService from '../../../../services/ApiService/ApiService';
import { getPaymentMethods, paymentMethods } from '../../../../utils/paths';
import { withRouter } from 'react-router-dom';
import Card from './Card/Card';
import './DashboardPaymentMethods.css';
import { connect } from 'react-redux';
import { setLoader } from '../../../../actions/loaderActions';
import { setPaymentMethods } from '../../../../actions/paymentMethods';
import AddPaymentMethod from '../../../PaymentMethods/AddPaymentMethod/AddPaymentMethod';
import cardsImg from '../../../../assets/img/cards.png';
import NotItems from '../DashboardPurchased/NotItems/NotItems';

const DESCRIPTION = 'You have not added any payment methods yet.';

class DashboardPaymentMethods extends Component {
  state = {
    cards: [],
  };
  componentDidMount = () => {
    this.getPaymentHandler();
  };
  Api = new ApiService();

  getPaymentHandler = () => {
    this.props.setLoader(true);
    this.Api.getPaymentMethods(getPaymentMethods)
      .then(result => {
        this.props.setLoader(false);
        this.setState({ cards: result.data });
        this.props.setPaymentMethods(result.data);
      })
      .catch(e => {
        this.props.setLoader(false);
      });
  };

  goTo = () => {
    this.props.history.push(paymentMethods);
  };

  render() {
    return (
      <div className="dashboard-payment-methods">
        <div>
          <div className="dashboard-payment-methods-header">
            <h2 className="payment-header">Payment Method</h2>
            {this.props.cards.length > 0 && (
              <a className="payment-more" onClick={() => this.goTo()}>
                View More
              </a>
            )}
          </div>
        </div>
        {this.props.cards.length > 0 && !this.props.isLoading ? (
          <div className="payment-methods-cards-list">
            <Card key={this.props.cards[0].id} card={this.props.cards[0]} />
            <AddPaymentMethod
              addPaymentHandler={this.goTo}
              title={'More payments options'}
              isAdd={false}
            />
          </div>
        ) : (
          ''
        )}
        {!this.props.cards.length && !this.props.isLoading ? (
          <NotItems
            img={cardsImg}
            description={DESCRIPTION}
            clickHandler={this.goTo}
            btnTitle="Add payment method"
            clName="dpm"
          />
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoader: status => dispatch(setLoader(status)),
    setPaymentMethods: cards => dispatch(setPaymentMethods(cards)),
  };
};
const mapStateToProps = state => ({
  isLoading: state.loader.isLoading,
  cards: state.paymentMethods.cards,
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardPaymentMethods)
);
