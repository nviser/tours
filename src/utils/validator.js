import moment from 'moment';

const processNumber = val => {
  let result = [];
  const test = val.split('');
  test.forEach(item => {
    if (/\d/.test(item)) {
      result.push(item);
    }
  });
  return result.length;
};

export const validate = (validation, value) => {
  let isValid;
  let yearsOld;
  switch (validation.type) {
    case 'email':
      isValid = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(
        value
      );
      break;
    case 'url':
      isValid =
        value === '' ||
        /[-a-zA-Z0-9@:%_.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_.~#?&//=]*)?/gi.test(
          value
        );
      break;
    case 'number':
      isValid = /[^\d,]/g.test(value);
      break;
    case 'tel':
      isValid = /^(.{4})(.*)(.{6})$/g.test(value);
      break;
    case 'phone':
      isValid = value && processNumber(value) === validation.condition;
      break;
    case 'comparePasswords':
      isValid = value && value.newPassword === value.confirmPassword;
      break;
    case 'isRequired':
      isValid = value !== '' && value !== null && value;
      break;
    case 'minSize':
      isValid = value && value.length >= validation.condition;
      break;
    case 'maxSize':
      isValid = value && value.length <= validation.condition;
      break;
    case 'date':
      yearsOld = moment().diff(value, 'years');
      isValid = yearsOld > 18 && yearsOld < 150;
      break;
    default:
      break;
  }
  if (!isValid) {
    return validation;
  }
  return null;
};

export default {
  validate,
};
