/* global google */

import React from 'react';
// import { Link } from 'react-router-dom';
import {
  compose,
  withProps,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  // InfoWindow,
} from 'react-google-maps';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ApiService from '../../services/ApiService/ApiService';
import { setLoader } from '../../actions/loaderActions';
// import PropertiesService from '../../services/PropertiesService/PropertiesService';
import {
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setRouteStopParams,
  setAllProperties,
  setInfoWindow,
  setMapCenter,
  setRouteStopMarker,
} from '../../actions/mapActions';
import { propertiesPath } from '../../utils/paths';
import { DEFAULT_MAP_PARAMS, GOOGLE_MAP_LAYOUT } from '../../utils/const';
import { GOOGLE_MAP_API, GOOGLE_MAP_KEY } from '../../config';
// import startImg from '../../assets/img/start.svg';

const mapStateToProps = state => ({
  totalRouteStop: state.map.totalRouteStop,
  totalDistance: state.map.totalDistance,
  waypoints: state.map.waypoints,
  editedRouteId: state.routes.editedRouteId,
  properties: state.map.properties,
  allProperties: state.map.allProperties,
  travelMode: state.map.travelMode,
  infoWindow: state.map.infoWindow,
  mapCenter: state.map.mapCenter,
  routeStopMarker: state.map.routeStopMarker,
  property_data: state.property,
  postProperties: state.map.userPage.postProperties,
  selectedCategoryColor: state.routes.selectedCategoryColor,
});

const mapDispatchToProps = {
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setRouteStopParams,
  setAllProperties,
  setInfoWindow,
  setMapCenter,
  setLoader,
  setRouteStopMarker,
};

function renderMarkers(directions, markerName) {
  const markers = [];

  let counter = 1;
  if (directions) {
    const { routes } = directions;
    if (routes && routes.length > 0) {
      routes.forEach(r => {
        const { legs } = r;
        if (legs && legs.length > 0) {
          legs.forEach((l, lIndex) => {
            const { start_location } = l;
            if (start_location) {
              markers.push(
                <Marker
                  key={`marker${counter}`}
                  position={{
                    lat: start_location.lat(),
                    lng: start_location.lng(),
                  }}
                  color="red"
                  fillColor="red"
                  label={{
                    text: (counter++).toString(),
                    color: 'white',
                  }}
                  icon={require(`../../assets/img/markers/${markerName}.svg`)}
                />
              );
            }
            if (lIndex === legs.length - 1) {
              const { end_location } = l;
              if (end_location) {
                markers.push(
                  <Marker
                    key={`marker${counter}`}
                    position={{
                      lat: end_location.lat(),
                      lng: end_location.lng(),
                    }}
                    color="red"
                    fillColor="red"
                    label={{
                      text: (counter++).toString(),
                      color: 'white',
                    }}
                    icon={require(`../../assets/img/markers/${markerName}.svg`)}
                  />
                );
              }
            }
          });
        }
      });
    }
  }

  return markers;
}

const setRSParams = (data, props) => {
  if (Array.isArray(data.legs)) {
    const routeStopParams = data.legs.map(item => ({
      distance: item.distance,
      duration: item.duration,
    }));

    props.setRouteStopParams(routeStopParams);
  }
};

const setWP = arr => {
  const newAr = arr.map(item => ({
    location: new google.maps.LatLng(item.lat, item.lng),
  }));
  newAr.splice(newAr.length - 1, 1);
  newAr.splice(0, 1);
  return newAr;
};

const prepareGeoData = (el, index) => ({
  id: index,
  lat: el[0],
  lng: el[1],
});

const setAdditionalWP = wpArray => {
  const newWpAr = wpArray.map(item => [item.lat(), item.lng()]);
  return newWpAr || [];
};

const resetWaypoints = (paths, props) => {
  let arr = [];
  paths.forEach((item, i) => {
    if (!i) {
      arr.push([item.start_location.lat(), item.start_location.lng()]);
      arr = arr.concat(setAdditionalWP(item.via_waypoints));
      arr.push([item.end_location.lat(), item.end_location.lng()]);
    } else {
      arr = arr.concat(setAdditionalWP(item.via_waypoints));
      arr.push([item.end_location.lat(), item.end_location.lng()]);
    }
  });
  const newWP = arr.map((item, i) => prepareGeoData(item, i));
  props && props.setWaypoints(newWP);
};

const calculateTotalDist = (myroute, props) => {
  resetWaypoints(myroute.legs, props);
  let totalDist = 0;
  myroute.legs.forEach(item => {
    totalDist += item.distance.value;
  });

  return `${totalDist / 1000}`;
};

const Api = new ApiService();
// const PropDataService = new PropertiesService();

const setMap = (waypoints, self, travelMode) => {
  const DirectionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();
  const { props } = self;
  waypoints.length &&
    DirectionsService.route(
      {
        origin: new google.maps.LatLng(
          waypoints[0].lat || null,
          waypoints[0].lng || null
        ),
        destination: new google.maps.LatLng(
          waypoints[waypoints.length - 1].lat || null,
          waypoints[waypoints.length - 1].lng || null
        ),
        travelMode: google.maps.TravelMode[travelMode],
        waypoints: setWP(waypoints),
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
          self.setState({
            directions: result,
          });
          props.setTotalRouteStop(result.routes[0].legs.length);
          props.setTotalDistance(calculateTotalDist(result.routes[0]));
          setRSParams(result.routes[0], props);
        }
      }
    );
};

const getRouteWaypoints = self => {
  const { props } = self;
  if (props.waypoints && props.waypoints.length) {
    setMap(props.waypoints, self, props.travelMode);
  }
};

const getAllProperties = self => {
  const { props } = self;
  props.setLoader(true);
  Api.getComponent(propertiesPath)
    .then(res => {
      props.setAllProperties(res.data);
      props.setLoader(false);
    })
    .catch(() => props.setLoader(false));
};

const changeMapCenter = (props, newCoords, zoom) => {
  props.setMapCenter({ lat: newCoords[0], lng: newCoords[1], zoom });
};

const MapContainer = compose(
  withState('total', 'updateTotal', 0),
  withHandlers({}),
  withProps({
    googleMapURL: `${GOOGLE_MAP_API}?key=${GOOGLE_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: (
      <div style={{ height: 'calc(100vh - 80px)' }} className="side-map" />
    ),
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      getRouteWaypoints(this);
      if (this.props.globalMap) getAllProperties(this);
      this.props.setMapCenter(DEFAULT_MAP_PARAMS);
    },
    componentWillReceiveProps(next) {
      if (
        next.routeStopMarker.coords &&
        next.routeStopMarker.coords[0] &&
        next.routeStopMarker.coords[0] !== next.mapCenter.lat
      ) {
        changeMapCenter(this.props, next.routeStopMarker.coords, 13);
      }
      const checkDif = () => {
        let upd = false;
        next.waypoints.map((item, i) => {
          if (
            item.lat !== this.props.waypoints[i].lat ||
            item.lng !== this.props.waypoints[i].lng
          ) {
            upd = true;
          }
          return item;
        });
        return upd;
      };

      if (
        this.props.travelMode !== next.travelMode ||
        this.props.waypoints.length !== next.waypoints.length ||
        (this.props.waypoints.length && next.waypoints.length && checkDif())
      ) {
        setMap(next.waypoints, this, next.travelMode);
      }
    },
    componentWillUnmount() {
      this.props.setInfoWindow({});
    },
  })
)(props => {
  let directionsRef;

  const getDirections = () => {
    props.setTotalDistance(
      calculateTotalDist(directionsRef.getDirections().routes[0], props)
    );
    setRSParams(directionsRef.getDirections().routes[0], props);
  };

  const getGoogleMapProps = () => {
    const defaultMapProps = {
      defaultZoom: DEFAULT_MAP_PARAMS.zoom,
      defaultCenter: new google.maps.LatLng(
        DEFAULT_MAP_PARAMS.lat,
        DEFAULT_MAP_PARAMS.lng
      ),
      zoom: props.mapCenter.zoom,
      styles: GOOGLE_MAP_LAYOUT,
    };
    return defaultMapProps;
  };

  const defaultMapProps = {
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true,
    rotateControl: true,
    styles: GOOGLE_MAP_LAYOUT,
  };

  return (
    <GoogleMap
      defaultOptions={defaultMapProps}
      center={new google.maps.LatLng(props.mapCenter.lat, props.mapCenter.lng)}
      {...getGoogleMapProps()}
    >
      <DirectionsRenderer
        options={{
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: props.selectedCategoryColor.color
              ? props.selectedCategoryColor.color
              : '#2C855B',
            strokeOpacity: 1,
            strokeWeight: 2,
          },
        }}
        directions={props.directions}
        ref={r => (directionsRef = r)}
        onDirectionsChanged={() => {
          getDirections();
        }}
      />
      {renderMarkers(
        props.directions,
        props.selectedCategoryColor.name
          ? props.selectedCategoryColor.name.toLowerCase()
          : 'oval'
      )}
    </GoogleMap>
  );
});

MapContainer.propTypes = {
  setTotalRouteStop: PropTypes.func,
  setTotalDistance: PropTypes.func,
  totalRouteStop: PropTypes.number,
  totalDistance: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
