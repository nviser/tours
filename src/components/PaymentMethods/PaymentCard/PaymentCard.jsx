import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createPaymentMethod } from '../../../utils/paths';
import { setEditCard } from '../../../actions/paymentMethods';
import './PaymentCard.css';
import visaImg from '../../../assets/img/visa.png';
import masterImg from '../../../assets/img/master.png';
import amexImg from '../../../assets/img/amex.png';
import discoverImg from '../../../assets/img/discover.png';
import noCardImg from '../../../assets/img/nocard.jpg';

const mapDispatchToProps = {
  setEditCard,
};

class PaymentCard extends Component {
  state = {
    cardImg: null,
  };

  componentDidMount() {
    if (this.props.card && this.props.card.brand) {
      this.setCard(this.props.card.brand);
    } else {
      this.setCard('Unknown');
    }
  }

  goTo = () => {
    this.props.history.push(createPaymentMethod);
  };

  editCard = card => {
    this.props.setEditCard(card);
    this.goTo();
  };

  setCard = result => {
    switch (result) {
      case 'Visa':
        this.setCardImg(visaImg);
        break;
      case 'MasterCard':
        this.setCardImg(masterImg);
        break;
      case 'American Express':
        this.setCardImg(amexImg);
        break;
      case 'Discover':
        this.setCardImg(discoverImg);
        break;
      case 'Unknown':
        this.setCardImg(noCardImg);
        break;
      default:
        this.setCardImg(noCardImg);
    }
  };
  setCardImg = img => {
    this.setState({
      cardImg: img,
    });
  };

  render() {
    return (
      <div className="payment-card">
        <div className="card-header">
          <div className="card-left-block">
            <div className="card-number"> *******{this.props.card.last4}</div>
            <div className="card-expired">
              {this.props.card.exp_month} / {this.props.card.exp_year}
            </div>
          </div>
          <div className="card-rigth-block">
            {this.state.cardImg && <img src={this.state.cardImg} alt="" />}
          </div>
        </div>
        <div className="card-footer">
          <span
            className={`card-default ${
              this.props.card.is_default ? 'active' : ''
            }`}
          >
            Default
          </span>
          <a onClick={() => this.editCard(this.props.card)}>EDIT</a>
        </div>
      </div>
    );
  }
}
export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(PaymentCard)
);
