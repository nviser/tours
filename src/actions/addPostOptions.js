import {
  SET_PHOTO_OPTION,
  SET_WORK_OPTION,
  SET_DOCUMENT_OPTION,
  SET_PERMIT_DOCUMENT_OPTION,
  SET_HISTORICAL_DOCUMENT_OPTION,
  SET_HIST_DOCUMENT_COMPANY,
  SET_PERMIT_DOCUMENT_COMPANY,
  SET_DOCUMENT_ISSUED_BY,
  SET_PERMIT_DOCUMENT_AUTHOR,
  SET_HIST_DOCUMENT_AUTHOR,
  SET_DOCUMENT_PUBLISHED_BY,
  SET_DOCUMENT_YEAR,
  SET_SELECTED_DOCUMENT_TYPE,
  SET_EVENT_DATE,
  SET_COMPANY_WORK,
  SET_SELECTED_WORK_TYPE,
} from './types';

export const setPhotoOption = payload => dispatch =>
  dispatch({
    type: SET_PHOTO_OPTION,
    payload,
  });

export const setWorkOption = payload => dispatch =>
  dispatch({
    type: SET_WORK_OPTION,
    payload,
  });

export const setDocumentOption = payload => dispatch =>
  dispatch({
    type: SET_DOCUMENT_OPTION,
    payload,
  });

export const setPermitDocumentOption = payload => dispatch =>
  dispatch({
    type: SET_PERMIT_DOCUMENT_OPTION,
    payload,
  });

export const setHistoricalDocumentOption = payload => dispatch =>
  dispatch({
    type: SET_HISTORICAL_DOCUMENT_OPTION,
    payload,
  });

export const setPermitDocumentCompany = payload => dispatch =>
  dispatch({
    type: SET_PERMIT_DOCUMENT_COMPANY,
    payload,
  });

export const setHistDocumentCompany = payload => dispatch =>
  dispatch({
    type: SET_HIST_DOCUMENT_COMPANY,
    payload,
  });

export const setDocumentIssuedBy = payload => dispatch =>
  dispatch({
    type: SET_DOCUMENT_ISSUED_BY,
    payload,
  });

export const setPermitDocumentAuthor = payload => dispatch =>
  dispatch({
    type: SET_PERMIT_DOCUMENT_AUTHOR,
    payload,
  });

export const setHistDocumentAuthor = payload => dispatch =>
  dispatch({
    type: SET_HIST_DOCUMENT_AUTHOR,
    payload,
  });

export const setDocumentPublishedBy = payload => dispatch =>
  dispatch({
    type: SET_DOCUMENT_PUBLISHED_BY,
    payload,
  });

export const setDocumentYear = payload => dispatch =>
  dispatch({
    type: SET_DOCUMENT_YEAR,
    payload,
  });

export const setSelectedDocType = payload => dispatch =>
  dispatch({
    type: SET_SELECTED_DOCUMENT_TYPE,
    payload,
  });

export const setSelectedWorkType = payload => dispatch =>
  dispatch({
    type: SET_SELECTED_WORK_TYPE,
    payload,
  });

export const setEventDate = payload => dispatch =>
  dispatch({
    type: SET_EVENT_DATE,
    payload,
  });

export const setCompanyWork = payload => dispatch =>
  dispatch({
    type: SET_COMPANY_WORK,
    payload,
  });
