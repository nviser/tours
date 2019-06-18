import { SET_COMPANY_DATA } from '../actions/types';

export const setCompanyData = payload => dispatch =>
  dispatch({
    type: SET_COMPANY_DATA,
    payload,
  });
