import {
  SET_SUGGESTIONS,
  SET_SELECTED_PROPERTY_SUGGESTION,
  SET_SELECTED_WORK_COMPANY_SUGGESTION,
  SET_SELECTED_HIST_DOC_COMPANY_SUGGESTION,
  SET_SELECTED_PER_DOC_COMPANY_SUGGESTION,
  SET_SELECTED_SIGNUP_SUGGESTION,
} from './types';

export const setSuggestions = payload => dispatch =>
  dispatch({
    type: SET_SUGGESTIONS,
    payload,
  });

export const setSelectedPropertySuggestions = payload => dispatch =>
  dispatch({
    type: SET_SELECTED_PROPERTY_SUGGESTION,
    payload,
  });

export const setSelectedWorkCompanySuggestions = payload => dispatch =>
  dispatch({
    type: SET_SELECTED_WORK_COMPANY_SUGGESTION,
    payload,
  });

export const setSelectedHistDocCompanySuggestions = payload => dispatch =>
  dispatch({
    type: SET_SELECTED_HIST_DOC_COMPANY_SUGGESTION,
    payload,
  });

export const setSelectedPerDocCompanySuggestions = payload => dispatch =>
  dispatch({
    type: SET_SELECTED_PER_DOC_COMPANY_SUGGESTION,
    payload,
  });
export const setSelectedSignUpSuggestions = payload => dispatch =>
  dispatch({
    type: SET_SELECTED_SIGNUP_SUGGESTION,
    payload,
  });
