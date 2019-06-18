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
} from './types';

export const setTotalRouteStop = payload => dispatch =>
  dispatch({
    type: SET_TOTAL_ROUTE_STOP,
    payload,
  });

export const setTotalDistance = payload => dispatch =>
  dispatch({
    type: SET_TOTAL_DISTANCE,
    payload,
  });

export const setWaypoints = payload => dispatch =>
  dispatch({
    type: SET_WAYPOINTS,
    payload,
  });

export const setProperties = payload => dispatch =>
  dispatch({
    type: SET_PROPERTIES,
    payload,
  });

export const setAllProperties = payload => dispatch =>
  dispatch({
    type: SET_ALL_PROPERTIES,
    payload,
  });

export const setTravelMode = payload => dispatch =>
  dispatch({
    type: SET_TRAVEL_MODE,
    payload,
  });

export const setRouteStopMarker = payload => dispatch =>
  dispatch({
    type: SET_ROUTE_STOP_MARKER,
    payload,
  });

export const setRouteStopParams = payload => dispatch =>
  dispatch({
    type: SET_ROUTE_STOP_PARAMS,
    payload,
  });

export const setInfoWindow = payload => dispatch =>
  dispatch({
    type: SET_INFO_WINDOW,
    payload,
  });

export const setMapCenter = payload => dispatch =>
  dispatch({
    type: SET_MAP_CENTER,
    payload,
  });

export const setUserPostsProperties = payload => dispatch =>
  dispatch({
    type: SET_USER_POSTS_PROPERTIES,
    payload,
  });

export const setPoint = payload => dispatch =>
  dispatch({
    type: SET_POINT,
    payload,
  });

export const resetMapData = () => {
  return {
    type: RESET_MAP_DATA,
  };
};

export const setUserCurrentLocation = payload => dispatch =>
  dispatch({
    type: SET_USER_CURRENT_LOCATION,
    payload,
  });

export const disRerenderMap = payload => dispatch =>
  dispatch({
    type: DIS_RERENDER_MAP,
    payload,
  });

export const setMapRoutes = payload => dispatch =>
  dispatch({
    type: SET_MAP_ROUTES,
    payload,
  });
