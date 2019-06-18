import {
  SET_SIGN_UP_FORM_ERRORS,
  SET_SIGN_UP_FORM_FIELD,
  CLEAR_SIGN_UP_FORM,
} from '../actions/types';

const initialState = {
  errors: {},
  fieldsValidations: {
    first_name: {
      validations: [
        {
          type: 'isRequired',
          message: 'First name is required',
        },
      ],
    },
    last_name: {
      validations: [
        {
          type: 'isRequired',
          message: 'Last name is required',
        },
      ],
    },
    email: {
      validations: [
        {
          type: 'email',
          message: 'Email is invalid',
        },
      ],
    },
    password: {
      validations: [
        {
          type: 'minSize',
          message: 'Password should be at least 8 chars long',
          condition: '8',
        },
      ],
    },
    re_password: {
      validations: [
        {
          type: 'minSize',
          message: 'Password should be at least 8 chars long',
          condition: '8',
        },
      ],
    },
    // regPhone: {
    //   validations: [
    //     {
    //       type: 'isRequired',
    //       message: 'Phone number is required'
    //     }
    //   ]
    // },
    // regAddress: {
    //   validations: [
    //     {
    //       type: 'isRequired',
    //       message: 'Address is required'
    //     }
    //   ]
    // }
  },
  form: {
    type: 'signUpForm',
    regFirstName: '',
    regLastName: '',
    regEmail: '',
    regPass: '',
    regConfirmPass: '',
    regPhone: '',
    regAddress: '',
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_SIGN_UP_FORM_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case SET_SIGN_UP_FORM_FIELD:
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: action.payload.value,
        },
      };
    case CLEAR_SIGN_UP_FORM:
      return initialState;
    default:
      return state;
  }
};
