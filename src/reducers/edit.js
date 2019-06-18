import {
  SET_USER_FOR_EDIT,
  EDIT_USER,
  SET_CHANGE_PASS_POPUP,
  SET_PASS,
  CLEAR_CHANGE_PASS_FORM,
  SET_PASS_FORM_ERRORS,
  SET_COMPANY_FOR_EDIT,
  EDIT_COMPANY,
  SWITCH_RANGE_PICKER,
} from '../actions/types';

const initialState = {
  user: {},
  company: {},
  passPopupIsShown: false,
  password: {},
  errors: {},
  isRangePickerOpen: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_USER_FOR_EDIT:
      return {
        ...state,
        user: action.payload,
      };
    case EDIT_USER:
      return {
        ...state,
        user: {
          ...state.user,
          [action.payload.name]: action.payload.value,
        },
      };
    case SET_CHANGE_PASS_POPUP:
      return {
        ...state,
        passPopupIsShown: action.payload,
      };
    case SET_PASS:
      return {
        ...state,
        password: {
          ...state.password,
          [action.payload.name]: action.payload.value,
        },
      };
    case SET_PASS_FORM_ERRORS:
      return {
        ...state,
        errors: {
          ...state.errors,
          password: action.payload,
        },
      };
    case CLEAR_CHANGE_PASS_FORM:
      return initialState;
    case SET_COMPANY_FOR_EDIT:
      return {
        ...state,
        company: action.payload,
      };
    case EDIT_COMPANY:
      return {
        ...state,
        company: {
          ...state.company,
          [action.payload.name]: action.payload.value,
        },
      };
    case SWITCH_RANGE_PICKER:
      return {
        ...state,
        isRangePickerOpen: action.payload,
      };
    default:
      return state;
  }
};
