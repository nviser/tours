import {
  SET_SUGGESTIONS,
  SET_SELECTED_PROPERTY_SUGGESTION,
  SET_SELECTED_WORK_COMPANY_SUGGESTION,
  SET_SELECTED_HIST_DOC_COMPANY_SUGGESTION,
  SET_SELECTED_PER_DOC_COMPANY_SUGGESTION,
  SET_SELECTED_SIGNUP_SUGGESTION,
} from '../actions/types';

const initialState = {
  suggestions: [],
  selectedPropertySuggestion: {},
  selectedWorkCompanySuggestion: {},
  selectedPerDocCompanySuggestion: {},
  selectedHistDocCompanySuggestion: {},
  selectedSignUpSuggestion: {},
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.payload,
      };
    case SET_SELECTED_PROPERTY_SUGGESTION:
      return {
        ...state,
        selectedPropertySuggestion: action.payload,
      };
    case SET_SELECTED_WORK_COMPANY_SUGGESTION:
      return {
        ...state,
        selectedWorkCompanySuggestion: action.payload,
      };
    case SET_SELECTED_HIST_DOC_COMPANY_SUGGESTION:
      return {
        ...state,
        selectedHistDocCompanySuggestion: action.payload,
      };
    case SET_SELECTED_PER_DOC_COMPANY_SUGGESTION:
      return {
        ...state,
        selectedPerDocCompanySuggestion: action.payload,
      };
    case SET_SELECTED_SIGNUP_SUGGESTION:
      return {
        ...state,
        selectedSignUpSuggestion: action.payload,
      };
    default:
      return state;
  }
};
