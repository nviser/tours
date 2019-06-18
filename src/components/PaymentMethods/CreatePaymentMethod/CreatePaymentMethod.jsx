import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Header from '../../Header/Header';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';
import { setLoader } from '../../../actions/loaderActions';
import SidePanel from '../../SidePanel/SidePanel';
import Modal from '../../UI/Modal/Modal';
import ApiService from '../../../services/ApiService/ApiService';
import ValidationService from '../../../services/ValidationService/ValidationService';
import PaymentCardDelete from '../PaymentCardDelete/PaymentCardDelete';
import { paymentMethods, getPaymentMethods } from '../../../utils/paths';
import './CreatePaymentMethod.css';
import backArrow from '../../../assets/img/merchant/back.png';
import visaImg from '../../../assets/img/visa.png';
import masterImg from '../../../assets/img/master.png';
import amexImg from '../../../assets/img/amex.png';
import discoverImg from '../../../assets/img/discover.png';
import noCardImg from '../../../assets/img/nocard.jpg';
import navItems from '../../User/navItems';
import Input from '../../Input';
import SidePanelMobile from '../../SidePanelMobile/SidePanelMobile';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';

const mapStateToProps = state => ({
  cards: state.paymentMethods.cards,
  edited_card: state.paymentMethods.edited_card,
  userData: state.auth.userData,
});

const mapDispatchToProps = {
  setLoader,
};

class CreatePaymentMethod extends Component {
  state = {
    form: {},
    errors: {},
    stripe: null,
    card: {},
    cardReadOnly: false,
    modal: false,
    is_default: this.props.edited_card
      ? this.props.edited_card.is_default
      : false,
    cardType: 'Unknown',
    cardImg: null,
    serverErr: null,
  };
  componentDidMount() {
    if (this.props.edited_card && this.props.edited_card.id) {
      this.setState({
        cardReadOnly: true,
      });
      this.props.cards.forEach(item => {
        if (item.id === this.props.edited_card.id) {
          this.setState({
            form: {
              brand: item.brand,
              month: item.exp_month && item.exp_month.toString(),
              year: item.exp_year && item.exp_year.toString(),
              cardNumber: `**** **** **** ${item.last4}`,
              cvv: '***',
            },
            is_default: item.is_default,
          });
          if (item.brand) {
            this.setCard(item.brand);
          } else {
            this.setCard('Unknown');
          }
        }
      });
    }
  }
  closeModalHandler = () => {
    this.setState({ modal: false });
  };
  openModalHandler = () => {
    this.setState({ modal: true });
  };
  deleteCardHandler = () => {
    this.props.setLoader(true);
    if (this.props.edited_card && this.props.edited_card.id) {
      this.Api.deleteComponent(
        `${getPaymentMethods}/${this.props.edited_card.id}`
      )
        .then(() => {
          this.props.setLoader(false);
          this.goBack();
        })
        .catch(err => {
          this.props.setLoader(false);
          this.setState({
            modal: false,
          });
        });
    }
  };

  goBack = () => {
    this.props.history.push(paymentMethods);
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
        this.setCardImg(null);
    }
  };
  setCardImg = img => {
    this.setState({
      cardImg: img,
    });
  };

  onChangeCard = (value, name) => {
    this.resetServerErr();
    if (value.length > 16) return;
    if (
      value === '' ||
      (name === 'cardNumber' && this.Validate.validateCard(value))
    ) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    }

    this.setCard(this.Validate.getCreditCardType(value));
  };

  onChange = (value, name) => {
    this.resetServerErr();
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
  };
  validate = (value, name) => {
    switch (name) {
      case 'month':
        return this.validateMonth(value);
      default:
        return this.validateMonth(value);
    }
  };
  onChangeMonth = (value, name) => {
    this.resetServerErr();
    this.setState({
      form: {
        ...this.state.form,
        [name]: this.Validate.validateMonth(value),
      },
    });
  };
  onChangeYear = (value, name) => {
    this.resetServerErr();
    if (
      value === '' ||
      (value.substr(0, 1) === '2' &&
        this.Validate.validateCard(value) &&
        value.length <= 4)
    ) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    }
  };
  onChangeCvv = (value, name) => {
    this.resetServerErr();
    if (value.length > 4) return;
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
  };
  resetServerErr = () => {
    this.setState({ serverErr: false });
  };

  handleToggleChange = e => {
    this.setState({
      is_default: e.target.checked,
    });
  };

  saveDefaultStatus = () => {
    const data = { is_default: this.state.is_default };
    if (this.props.edited_card && this.props.edited_card.id) {
      this.props.setLoader(true);
      this.Api.patchComponent(
        data,
        `${getPaymentMethods}/${this.props.edited_card.id}`
      )
        .then(() => this.props.setLoader(false))
        .catch(err => this.props.setLoader(false));
    }
  };
  sendCard = () => {
    const { cardHolder, cardNumber, month, year, cvv } = this.state.form;
    if (cardHolder && cardNumber && month && year && cvv) {
      const data = {
        //"card_token": "tok_visa",
        card_holder: cardHolder,
        number: cardNumber,
        exp_month: month,
        exp_year: year,
        cvc: cvv,
        is_default: this.state.is_default,
      };
      this.props.setLoader(true);
      this.Api.sendComponent(data, getPaymentMethods)
        .then(() => {
          this.props.setLoader(false);
          this.goBack();
        })
        .catch(err => {
          this.props.setLoader(false);
          if (
            err.response.data &&
            err.response.data.error &&
            err.response.data.error.msg
          ) {
            //this.alertToggler(err.response.data.error.msg);
            this.setState({ serverErr: err.response.data.error.msg });
          } else if (err.response.data && err.response.data.message) {
            //this.alertToggler(err.response.data.message);
            this.setState({ serverErr: err.response.data.message });
          }
        });
    }
  };
  disableSend = () => {
    const { cardHolder, cardNumber, month, year, cvv } = this.state.form;
    if (cardHolder && cardNumber && month && year && cvv) {
      return false;
    }
    return true;
  };
  //     Object.keys(fieldsValidations).forEach((fieldKey) => {
  //     const errors = [];
  //     fieldsValidations[fieldKey].validations.forEach((validation) => {
  //     const error = validate(validation, form[fieldKey]);
  //     if (error) {
  //         hasErrors = true;
  //         errors.push(error);
  //     }
  // });
  // formErrors[fieldKey] = errors;
  // });

  Api = new ApiService();
  Validate = new ValidationService();
  render() {
    return (
      <div className="create-payment-method">
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
                <Col lg={9} md={8} sm={8} xs={12} className="right-col">
                  <div className="create-payment-method-back">
                    <button className="go-back-btn" onClick={this.goBack}>
                      <img src={backArrow} alt="create-payment-method-back" />
                      Go Back
                    </button>
                  </div>
                  <div className="create-payment-form">
                    <div className="add-methods-details">
                      {this.state.cardReadOnly
                        ? 'Update Payments Methods'
                        : 'Add Method Details'}
                    </div>
                    <Input
                      id="cardHolder"
                      label="Card Holder"
                      className="create-payment-input"
                      wrapperClass={`form-control-group form-block ${
                        this.state.cardReadOnly ? 'hidden' : ''
                      }`}
                      value={this.state.form.cardHolder}
                      type="text"
                      isRequired
                      onChange={this.onChange}
                      errors={this.state.errors.cardHolder}
                      disabled={this.state.cardReadOnly}
                      placeHolder="Enter your first and last name"
                    />
                    <div
                      className={`edit-card-number form-block ${
                        this.state.cardReadOnly ? 'hidden' : ''
                      }`}
                    >
                      <Input
                        id="cardNumber"
                        label={`Card Number${
                          this.state.cardReadOnly
                            ? ': ' + this.state.form.cardNumber
                            : ''
                        }`}
                        className="create-payment-input"
                        wrapperClass={`form-control-group ${
                          this.state.cardReadOnly ? 'hidden' : ''
                        }`}
                        value={this.state.form.cardNumber}
                        type="text"
                        isRequired
                        onChange={this.onChangeCard}
                        errors={this.state.errors.cardNumber}
                        disabled={this.state.cardReadOnly}
                        placeHolder="Enter your card number"
                      />
                      {this.state.cardImg && (
                        <img
                          className="card-img"
                          src={this.state.cardImg}
                          alt="card"
                        />
                      )}
                    </div>
                    <div
                      className={`edit-card-number form-block ${
                        this.state.cardReadOnly ? 'read-only' : 'hidden'
                      }`}
                    >
                      <Input
                        id="cardNumber2"
                        label={`Card Number${
                          this.state.cardReadOnly
                            ? ': ' + this.state.form.cardNumber
                            : ''
                        }`}
                        className="create-payment-input"
                        wrapperClass={`form-control-group update-method ${
                          this.state.cardReadOnly ? '' : 'hidden'
                        }`}
                        value={''}
                        type="text"
                        isRequired
                        onChange={this.onChange}
                        errors={this.state.errors.cardNumber}
                        disabled={this.state.cardReadOnly}
                      />
                      {this.state.cardImg && (
                        <img
                          className="card-img"
                          src={this.state.cardImg}
                          alt="card"
                        />
                      )}
                    </div>
                    <div className="create-payment-method-card-date form-block">
                      <Input
                        id="month"
                        label="Month"
                        className="create-payment-input"
                        wrapperClass="form-control-group"
                        value={this.state.form.month}
                        type="text"
                        isRequired
                        onChange={this.onChangeMonth}
                        errors={this.state.errors.month}
                        disabled={this.state.cardReadOnly}
                        placeHolder="01"
                      />
                      <Input
                        id="year"
                        label="Year"
                        className="create-payment-input"
                        wrapperClass="form-control-group"
                        value={this.state.form.year}
                        type="text"
                        isRequired
                        onChange={this.onChangeYear}
                        errors={this.state.errors.year}
                        disabled={this.state.cardReadOnly}
                        placeHolder="2030"
                      />
                      <Input
                        id="cvv"
                        label="CVV"
                        className="create-payment-input"
                        wrapperClass="form-control-group"
                        value={this.state.form.cvv}
                        type="password"
                        isRequired
                        onChange={this.onChangeCvv}
                        errors={this.state.errors.cvv}
                        disabled={this.state.cardReadOnly}
                        placeHolder="***"
                      />
                    </div>
                    <div className="default-toggler">
                      <Toggle
                        defaultChecked={this.state.is_default}
                        icons={false}
                        onChange={e => this.handleToggleChange(e)}
                      />
                      <span className="toggle-text">set as default card</span>
                    </div>
                    {this.state.serverErr && (
                      <div className="modal-sign-in-warn-message warn-color error">
                        {this.state.serverErr}
                      </div>
                    )}
                    <div
                      className={`button-block ${
                        this.state.cardReadOnly ? '' : 'right'
                      }`}
                    >
                      <button
                        className={`del-card ${
                          this.state.cardReadOnly ? '' : 'hidden'
                        }`}
                        onClick={this.openModalHandler}
                      >
                        delete card
                      </button>
                      <button
                        className={`save-card ${
                          this.state.cardReadOnly ? '' : 'hidden'
                        }`}
                        onClick={this.saveDefaultStatus}
                      >
                        save
                      </button>
                      <button
                        className={`save-card ${
                          this.state.cardReadOnly ? 'hidden' : 'pull-right'
                        }`}
                        onClick={this.sendCard}
                        disabled={this.disableSend()}
                      >
                        save
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
          <Modal show={this.state.modal}>
            <PaymentCardDelete
              onCancel={this.closeModalHandler}
              onDeleteCard={this.deleteCardHandler}
            />
          </Modal>
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePaymentMethod);
