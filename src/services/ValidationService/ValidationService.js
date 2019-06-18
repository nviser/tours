export default class validationService {
  validateEmail = email => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
  };
  validateCard = value => {
    return /^\d+$/.test(value);
  };
  validateMonth = month => {
    if (month) {
      if (month.length === 1 && /[2-9]/.test(month)) {
        return '0' + month;
      } else if (month.length === 1 && /[0-1]/.test(month)) {
        return month;
      } else if (month.length === 1 && !/[\d+]/.test(month)) {
        return '';
      } else if (month.length === 2 && !/[0,1]/.test(month.substr(0, 1))) {
        return month.substr(0, 1);
      } else if (
        month.length === 2 &&
        /1/.test(month.substr(0, 1)) &&
        !/[0-2]/.test(month.substr(1, 2))
      ) {
        return month.substr(0, 1);
      } else if (
        month.length === 2 &&
        /[0]/.test(month.substr(0, 1)) &&
        /[1-9]/.test(month.substr(1, 2))
      ) {
        return month;
      } else if (
        month.length === 2 &&
        /[0]/.test(month.substr(0, 1)) &&
        /[0]/.test(month.substr(1, 2))
      ) {
        return month.substr(0, 1);
      } else if (month.length > 2) {
        return month.substr(0, 2);
      }
      return month;
    }
  };
  getCreditCardType = creditCardNumber => {
    // start without knowing the credit card type
    let result = '';
    if (/\*/.test(creditCardNumber)) {
      result = 'Unknown';
    }
    // first check for MasterCard
    if (/^5[1-5]/.test(creditCardNumber)) {
      result = 'MasterCard';
    }
    // then check for Visa
    else if (/^4/.test(creditCardNumber)) {
      result = 'Visa';
    }
    // then check for AmEx
    else if (/^3[47]/.test(creditCardNumber)) {
      result = 'American Express';
    }
    // // then check for Diners
    // else if (/3(?:0[0-5]|[68][0-9])[0-9]{11}/.test(creditCardNumber)) {
    //     result = "Diners"
    // }
    // then check for Discover
    else if (/6(?:011|5[0-9]{2})[0-9]{12}/.test(creditCardNumber)) {
      result = 'Discover';
    } else if (/\d+/.test(creditCardNumber)) {
      result = 'Unknown';
    } else {
      result = '';
    }
    return result;
  };
}
