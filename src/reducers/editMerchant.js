import {
  EDIT_MERCHANT_FORM_ERRORS,
  EDIT_MERCHANT_FORM_FIELD,
  CLEAR_MERCHANT_EDIT_FORM,
  SET_EDITABLE_MERCHANT_DATA,
} from '../actions/types';

const initialState = {
  errors: {},
  fieldsValidations: {
    legal_entity_name: {
      validations: [
        {
          type: 'isRequired',
          message: 'Name is required',
        },
      ],
    },
    account_number: {
      validations: [
        {
          type: 'isRequired',
          message: 'Account number is required',
        },
      ],
    },
    identification_number: {
      validations: [
        {
          type: 'isRequired',
          message: 'Identification number is required',
        },
      ],
    },
  },
  form: {
    legal_entity_name: '',
    account_number: '',
    identification_number: '',
  },
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case EDIT_MERCHANT_FORM_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case EDIT_MERCHANT_FORM_FIELD:
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: action.payload.value,
        },
      };
    case SET_EDITABLE_MERCHANT_DATA:
      return {
        ...state,
        form: action.payload,
      };
    case CLEAR_MERCHANT_EDIT_FORM:
      return initialState;
    default:
      return state;
  }
};
