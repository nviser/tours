import {
  SET_TOUR_OPERATOR_FORM_ERRORS,
  SET_TOUR_OPERATOR_FORM_FIELD,
  CLEAR_TOUR_OPERATOR_FORM,
  SET_EDITABLE_USER_DATA,
  SET_TOUR_OPERATOR_FORM,
} from '../actions/types';

const initialState = {
  errors: {},
  fieldsValidations: {
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
    website_url: '',
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_TOUR_OPERATOR_FORM_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case SET_TOUR_OPERATOR_FORM_FIELD:
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: action.payload.value,
        },
      };
    case SET_TOUR_OPERATOR_FORM:
      return {
        ...state,
        form: action.payload,
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
