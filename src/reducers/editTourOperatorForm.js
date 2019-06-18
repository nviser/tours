import {
  EDIT_TOUR_OPERATOR_FORM_ERRORS,
  EDIT_TOUR_OPERATOR_FORM_FIELD,
  CLEAR_TOUR_OPERATOR_FORM,
  SET_EDITABLE_USER_DATA,
} from '../actions/types';

const initialState = {
  errors: {},
  fieldsValidations: {
    display_name: {
      validations: [
        {
          type: 'isRequired',
          message: 'Tour Operator Display name is required',
        },
      ],
    },
    summary: {
      validations: [
        {
          type: 'isRequired',
          message: 'Address is required',
        },
      ],
    },
    website_url: {
      validations: [
        {
          type: 'url',
          message: 'Website address is incorrect',
        },
      ],
    },
  },
  form: {
    display_name: '',
    summary: '',
    website_url: '',
    facebook_account: '',
    linkedin_account: '',
    instagram_account: '',
    twitter_account: '',
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case EDIT_TOUR_OPERATOR_FORM_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case EDIT_TOUR_OPERATOR_FORM_FIELD:
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: action.payload.value,
        },
      };
    case SET_EDITABLE_USER_DATA:
      return {
        ...state,
        form: action.payload,
      };
    case CLEAR_TOUR_OPERATOR_FORM:
      return initialState;
    default:
      return state;
  }
};
