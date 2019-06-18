import {
  SET_TOTAL_ROUTE_STOP,
  SET_TOTAL_DISTANCE,
  SET_WAYPOINTS,
  SET_PROPERTIES,
  SET_ALL_PROPERTIES,
  SET_TRAVEL_MODE,
  SET_ROUTE_STOP_MARKER,
  SET_ROUTE_STOP_PARAMS,
  SET_INFO_WINDOW,
  SET_MAP_CENTER,
  SET_USER_POSTS_PROPERTIES,
  SET_POINT,
  RESET_MAP_DATA,
  SET_USER_CURRENT_LOCATION,
  DIS_RERENDER_MAP,
  SET_MAP_ROUTES,
} from '../actions/types';

const initialState = {
  totalRouteStop: 0,
  totalDistance: '0',
  waypoints: [],
  properties: [],
  allProperties: [],
  travelMode: 'DRIVING',
  routeStopMarker: {
    palceId: '',
    coords: [],
  },
  routeStopParams: [],
  infoWindow: {},
  mapCenter: { lat: 0, lng: 0 },
  userPage: {
    postProperties: [],
  },
  points: [],
  currentUserLocation: {},
  disableMapRerender: false,
  allMapRoutes: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_TOTAL_ROUTE_STOP:
      return {
        ...state,
        totalRouteStop: action.payload,
      };
    case SET_TOTAL_DISTANCE:
      return {
        ...state,
        totalDistance: action.payload,
      };
    case SET_WAYPOINTS:
      return {
        ...state,
        waypoints: action.payload,
      };
    case SET_PROPERTIES:
      return {
        ...state,
        properties: action.payload,
      };
    case SET_ALL_PROPERTIES:
      return {
        ...state,
        allProperties: action.payload,
      };
    case SET_TRAVEL_MODE:
      return {
        ...state,
        travelMode: action.payload,
      };
    case SET_ROUTE_STOP_MARKER:
      return {
        ...state,
        routeStopMarker: {
          ...action.payload,
        },
      };
    case SET_ROUTE_STOP_PARAMS:
      return {
        ...state,
        routeStopParams: action.payload,
      };
    case SET_INFO_WINDOW:
      return {
        ...state,
        infoWindow: action.payload,
      };
    case SET_MAP_CENTER:
      return {
        ...state,
        mapCenter: action.payload,
      };
    case SET_USER_POSTS_PROPERTIES:
      return {
        ...state,
        userPage: {
          postProperties: action.payload,
        },
      };
    case SET_POINT:
      return {
        ...state,
        points: action.payload,
      };
    case SET_USER_CURRENT_LOCATION:
      return {
        ...state,
        currentUserLocation: action.payload,
      };
    case DIS_RERENDER_MAP:
      return {
        ...state,
        disableMapRerender: action.payload,
      };
    case SET_MAP_ROUTES:
      return {
        ...state,
        allMapRoutes: action.payload,
      };
    case RESET_MAP_DATA:
      return {
        ...state,
        routeStopMarker: {
          palceId: '',
          coords: [],
        },
        properties: [],
        routeStopParams: [],
        waypoints: [],
        totalRouteStop: 0,
        totalDistance: '0',
        mapCenter: { lat: 0, lng: 0 },
        points: [],
      };
    default:
      return state;
  }
};
