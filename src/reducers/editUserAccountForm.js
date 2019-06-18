import {
  EDIT_ACCOUNT_FORM_ERRORS,
  EDIT_ACCOUNT_FORM_FIELD,
  CLEAR_ACCOUNT_FORM,
  SET_ACCOUNT_DATA,
} from '../actions/types';

const initialState = {
  errors: {},
  fieldsValidations: {
    regFirstName: {
      validations: [
        {
          type: 'isRequired',
          message: 'First name is required',
        },
      ],
    },
    regLastName: {
      validations: [
        {
          type: 'isRequired',
          message: 'Last name is required',
        },
      ],
    },
    regEmail: {
      validations: [
        {
          type: 'email',
          message: 'Email is not valid',
        },
      ],
    },
  },
  form: {
    regFirstName: '',
    regLastName: '',
    regEmail: '',
    oldPass: '',
    regPass: '',
    regConfirmPass: '',
    regPhone: '',
    regAddress: '',
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case EDIT_ACCOUNT_FORM_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case EDIT_ACCOUNT_FORM_FIELD:
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: action.payload.value,
        },
      };
    case SET_ACCOUNT_DATA:
      return {
        ...state,
        form: action.payload,
      };
    case CLEAR_ACCOUNT_FORM:
      return initialState;
    default:
      return state;
  }
};
