import {
  SET_SIGN_IN_FORM_ERRORS,
  SET_SIGN_IN_FORM_FIELD,
  CLEAR_SIGN_IN_FORM,
} from '../actions/types';

const initialState = {
  errors: {},
  fieldsValidations: {
    logEmail: {
      validations: [
        {
          type: 'email',
          message: 'Email is invalid',
        },
      ],
    },
    logPass: {
      validations: [
        {
          type: 'minSize',
          message: 'Password should be at least 8 chars long',
          condition: '8',
        },
      ],
    },
  },
  form: {
    type: 'signInForm',
    logEmail: '',
    logPass: '',
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_SIGN_IN_FORM_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case SET_SIGN_IN_FORM_FIELD:
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: action.payload.value,
        },
      };
    case CLEAR_SIGN_IN_FORM:
      return initialState;
    default:
      return state;
  }
};
