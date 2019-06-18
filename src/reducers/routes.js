import {
  SELECT_ROUTES,
  SELECT_SINGLE_ROUTE,
  SET_ROUTE_TITLE,
  SET_ROUTES,
  SET_EDIT_ROUTE_ID,
  SET_TOUR_EDITABLE,
  SET_CATEGORIES,
  SET_CATEGORY_COLOR,
  SET_STATUS,
} from '../actions/types';

const initialState = {
  selectedRoutePoints: [],
  selectedSingleRoute: {},
  routeTitle: '',
  allRoutes: [],
  editedRouteId: null,
  editable: false,
  categories: null,
  selectedCategoryColor: '',
};

export default (state = initialState, action = []) => {
  switch (action.type) {
    case SELECT_ROUTES:
      return {
        ...state,
        selectedRoutePoints: action.payload,
      };
    case SELECT_SINGLE_ROUTE:
      return {
        ...state,
        selectedSingleRoute: action.payload,
      };
    case SET_ROUTE_TITLE:
      return {
        ...state,
        routeTitle: action.payload,
      };
    case SET_ROUTES:
      return {
        ...state,
        allRoutes: action.payload,
      };
    case SET_EDIT_ROUTE_ID:
      return {
        ...state,
        editedRouteId: action.payload,
      };
    case SET_TOUR_EDITABLE:
      return {
        ...state,
        editable: action.payload,
      };
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case SET_CATEGORY_COLOR:
      return {
        ...state,
        selectedCategoryColor: action.payload,
      };
    case SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    default:
      return state;
  }
};
