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
} from '../actions/types';

const initialState = {
  photo: false,
  work: false,
  document: false,
  permitDocument: false,
  historicalDocument: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_PHOTO_OPTION:
      return {
        ...state,
        photo: action.payload,
      };
    case SET_WORK_OPTION:
      return {
        ...state,
        work: action.payload,
      };
    case SET_DOCUMENT_OPTION:
      return {
        ...state,
        document: action.payload,
      };
    case SET_PERMIT_DOCUMENT_OPTION:
      return {
        ...state,
        permitDocument: action.payload,
      };
    case SET_HISTORICAL_DOCUMENT_OPTION:
      return {
        ...state,
        historicalDocument: action.payload,
      };
    case SET_HIST_DOCUMENT_COMPANY:
      return {
        ...state,
        histDocumentCompany: action.payload,
      };
    case SET_PERMIT_DOCUMENT_COMPANY:
      return {
        ...state,
        permitDocumentCompany: action.payload,
      };
    case SET_DOCUMENT_ISSUED_BY:
      return {
        ...state,
        documentIssuedBy: action.payload,
      };
    case SET_PERMIT_DOCUMENT_AUTHOR:
      return {
        ...state,
        permitDocumentAuthor: action.payload,
      };
    case SET_HIST_DOCUMENT_AUTHOR:
      return {
        ...state,
        histDocumentAuthor: action.payload,
      };
    case SET_DOCUMENT_PUBLISHED_BY:
      return {
        ...state,
        documentPublishedBy: action.payload,
      };
    case SET_DOCUMENT_YEAR:
      return {
        ...state,
        documentYear: action.payload,
      };
    case SET_SELECTED_DOCUMENT_TYPE:
      return {
        ...state,
        documentTypeSelected: action.payload,
      };
    case SET_SELECTED_WORK_TYPE:
      return {
        ...state,
        workTypeSelected: action.payload,
      };
    case SET_EVENT_DATE:
      return {
        ...state,
        eventDate: action.payload,
      };
    case SET_COMPANY_WORK:
      return {
        ...state,
        companyWork: action.payload,
      };
    default:
      return state;
  }
};
