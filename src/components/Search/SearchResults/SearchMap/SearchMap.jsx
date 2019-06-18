/* global google */

import React, { Fragment } from 'react';
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
} from 'react-google-maps';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ApiService from '../../../../services/ApiService/ApiService';
import SearchService from '../../../../services/SearchService/SearchService';
import { API_URL } from '../../../../config';
import { MAP_MARKER_RADIUS, GOOGLE_MAP_LAYOUT } from '../../../../utils/const';
import { GOOGLE_MAP_API, GOOGLE_MAP_KEY } from '../../../../config';
import { withRouter } from 'react-router-dom';
import { setLoader } from '../../../../actions/loaderActions';
import { setStatus } from '../../../../actions/routes';
// import PropertiesService from '../../../../services/PropertiesService/PropertiesService';
import {
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setRouteStopParams,
  setAllProperties,
  setMapCenter,
  setRouteStopMarker,
  setUserCurrentLocation,
  disRerenderMap,
  setMapRoutes,
  setInfoWindow,
} from '../../../../actions/mapActions';
import { setRoutes } from '../../../../actions/routes';
import InfoWindowEx from './InfoWindowEx/InfoWindowEx';
import startImg from '../../../../assets/img/start.svg';
import {
  propertiesPath,
  routesApiPath,
  searchQueryPath,
  routeMarker,
  searchGroupApiPath,
  propertySearchPlacePath,
} from '../../../../utils/paths';
import {
  DEFAULT_MAP_PARAMS,
  GET_IP_API,
  GET_LOCATION_API,
} from '../../../../utils/const';

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
  disableMapRerender: state.map.disableMapRerender,
  routeStopMarker: state.map.routeStopMarker,
  property_data: state.property,
  postProperties: state.map.userPage.postProperties,
  allRoutes: state.routes.allRoutes,
  allMapRoutes: state.map.allMapRoutes,
});

const mapDispatchToProps = {
  setTotalRouteStop,
  setTotalDistance,
  setWaypoints,
  setRouteStopParams,
  setAllProperties,
  setMapCenter,
  setLoader,
  setRouteStopMarker,
  setRoutes,
  setUserCurrentLocation,
  disRerenderMap,
  setMapRoutes,
  setInfoWindow,
  setStatus,
};

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
const Search = new SearchService();

const setMap = (waypoints, self, travelMode) => {
  // console.log(travelMode);
  const DirectionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();
  const { props } = self;

  waypoints.map((waypoint, index) => {
    return (
      waypoint.length &&
      DirectionsService.route(
        {
          origin: new google.maps.LatLng(
            waypoint[0].lat || null,
            waypoint[0].lng || null
          ),
          destination: new google.maps.LatLng(
            waypoint[waypoint.length - 1].lat || null,
            waypoint[waypoint.length - 1].lng || null
          ),
          travelMode: google.maps.TravelMode[travelMode],
          waypoints: setWP(waypoint),
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            self.setState({
              ['directions_' + index]: result,
            });
            props.setTotalRouteStop(result.routes[0].legs.length);
            props.setTotalDistance(calculateTotalDist(result.routes[0]));
            setRSParams(result.routes[0], props);
          } else {
            // console.error(`error fetching directions ${result}`);
          }
        }
      )
    );
  });
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

const openInfoWindow = (lat, lng, props, id, ind) => {
  props.setInfo(lat, lng, props, id, ind);
};

// const changeMapCenter = (props, newCoords, zoom, self) => {
//   props.setMapCenter({ lat: newCoords[0], lng: newCoords[1], zoom });
//   getRoutesByLocation(newCoords[0], newCoords[1], zoom, self)
// };

const setColor = color => {
  return '%23' + color.substr(1, color.length - 1);
};

const detectRoute = (id, props, lat, lng, ind) => {
  props.setLoader(true);
  if (props.allRoutes.length > 1) {
    props.allRoutes.map(item => {
      if (item.id === id) {
        item.active = true;
        item.width = 4;
      } else {
        item.active = false;
        item.width = 2;
      }
      return item;
    });
  }
  props.setLoader(false);
  openInfoWindow(lat, lng, props, id, ind);
};

const prepareMapRender = (self, props, routes) => {
  let waypoints = [];
  routes.forEach(route => {
    if (route.waypoint.geometry) {
      waypoints.push(
        route.waypoint.geometry.coordinates.map((waypoint, index) => {
          return {
            id: index,
            lat: waypoint[1],
            lng: waypoint[0],
          };
        })
      );
    }
  });
  self.setState({
    allWaypoints: waypoints,
  });
  if (waypoints && waypoints.length) {
    setMap(waypoints, self, props.travelMode);
  }
};

const SearchMap = compose(
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
      console.log(this.props);
      if (this.props.globalMap) getAllProperties(this);
      const encodeLocation = (country, city) => {
        return `${city}%20${country}`;
      };
      const getLocation = pos => {
        const lat = pos.latitude,
          lng = pos.longitude,
          country = pos.country_name,
          city = pos.city;
        this.props.setMapCenter({ lat, lng, zoom: 12 });
        this.props.setUserCurrentLocation({
          lat,
          lng,
          zoom: 12,
          country,
          city,
        });
      };

      const checkSearchResults = obj => {
        let status = 0,
          len = Object.keys(obj).length;
        for (let key in obj) {
          if (Array.isArray(obj[key]) && !obj[key].length) {
            status++;
          }
        }
        return status === len;
      };

      // if search without query detect current user location and search nearest tours
      if (this.props.location.search.substr(7) === '') {
        this.props.setLoader(true);
        Search.getLocation(GET_IP_API)
          .then(res => {
            Search.getLocation(GET_LOCATION_API(res.data.ip))
              .then(res => {
                const geoData = res.data;
                Api.getComponent(
                  `${routesApiPath}?lat=${res.data.latitude}&lng=${
                    res.data.longitude
                  }&radius=${100000}`
                )
                  .then(res => {
                    this.props.setRoutes(res.data);
                    this.props.setMapRoutes(res.data);
                    this.props.setLoader(false);
                    getLocation(geoData);
                    if (!res.data.length)
                      this.props.setStatus('No matches found');
                    this.props.history.push(
                      `${searchQueryPath}${encodeLocation(
                        geoData.country,
                        geoData.city
                      )}`
                    );
                  })
                  .catch(() => this.props.setLoader(false));
              })
              .catch(() => {
                this.props.setLoader(false);
              });
          })
          .catch(() => {
            this.props.setLoader(false);
          });
      }

      if (this.props.allRoutes.length) {
        prepareMapRender(this, this.props, this.props.allRoutes);
      } else {
        const query = decodeURIComponent(this.props.location.search.substr(7));
        if (query) {
          this.props.setLoader(true);
          Search.searchProperty(searchGroupApiPath, query)
            .then(res => {
              if (checkSearchResults(res.data))
                this.props.setStatus('No matches found');
              if (res.data.locations[0].place_id) {
                Api.getComponent(
                  `${propertySearchPlacePath}?query=${
                    res.data.locations[0].place_id
                  }`
                )
                  .then(res => {
                    const coords = res.data.result.geometry.location;
                    Api.getComponent(
                      `${routesApiPath}?lat=${coords.lat}&lng=${
                        coords.lng
                      }&radius=${100000}`
                    )
                      .then(res => {
                        this.props.setLoader(false);
                        this.props.setRoutes(res.data);
                        this.props.setMapRoutes(res.data);
                        if (!res.data.length) {
                          this.props.setMapCenter({
                            lat: coords.lat,
                            lng: coords.lng,
                            zoom: DEFAULT_MAP_PARAMS.zoom,
                          });
                          this.props.setStatus('No matches found');
                        }
                      })
                      .catch(() => this.props.setLoader(false));
                  })
                  .catch(() => this.props.setLoader(false));
              } else {
                this.props.setStatus('No matches found');
              }
            })
            .catch(() => this.props.setLoader(false));
        }
      }
    },
    componentWillReceiveProps(next) {
      if (
        (next.allRoutes.length !== this.props.allRoutes.length &&
          next.allRoutes.length > 0) ||
        (next.allRoutes.length &&
          this.props.allRoutes.length &&
          next.allRoutes[0].waypoint &&
          (this.props.allRoutes[0].waypoint &&
            next.allRoutes[0].waypoint.geometry.coordinates[0][1] !==
              this.props.allRoutes[0].waypoint.geometry.coordinates[0][1]))
      ) {
        let waypoints = [];
        next.allRoutes.forEach(route => {
          if (route.waypoint.geometry) {
            waypoints.push(
              route.waypoint.geometry.coordinates.map((waypoint, index) => {
                return {
                  id: index,
                  lat: waypoint[1],
                  lng: waypoint[0],
                };
              })
            );
          }
        });
        this.setState({
          allWaypoints: waypoints,
        });
        if (waypoints && waypoints.length) {
          setMap(waypoints, this, this.props.travelMode);
        }
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
      this.props.disRerenderMap(false);
      this.props.setStatus('');
      this.props.setRoutes([]);
      this.props.setMapRoutes([]);
    },
  })
)(props => {
  // let directionsRef;

  // const getDirections = () => {
  //   props.setTotalDistance(calculateTotalDist(directionsRef.getDirections().routes[0], props));
  //   setRSParams(directionsRef.getDirections().routes[0], props);
  // };

  const getGoogleMapProps = () => {
    const mapProps = {
      defaultZoom: DEFAULT_MAP_PARAMS.zoom,
      defaultCenter: new google.maps.LatLng(
        DEFAULT_MAP_PARAMS.lat,
        DEFAULT_MAP_PARAMS.lng
      ),
      zoom: props.mapCenter.zoom,
      disableDefaultUI: true,
      zoomControl: true,
      scaleControl: true,
      rotateControl: true,
      styles: GOOGLE_MAP_LAYOUT,
    };
    if (props.allRoutes.length > 0) {
      return mapProps;
    } else {
      return {
        ...mapProps,
        center: new google.maps.LatLng(
          props.mapCenter.lat,
          props.mapCenter.lng
        ),
        zoom: DEFAULT_MAP_PARAMS.zoom,
      };
    }
  };
  const defaultMapProps = {
    disableDefaultUI: true,
    defaultCenter: new google.maps.LatLng(
      DEFAULT_MAP_PARAMS.lat,
      DEFAULT_MAP_PARAMS.lng
    ),
    defaultZoom: DEFAULT_MAP_PARAMS.zoom,
    zoomControl: true,
    // mapTypeControl: true,
    scaleControl: true,
    //streetViewControl: true,
    rotateControl: true,
    //fullscreenControl: true,
    styles: GOOGLE_MAP_LAYOUT,
  };

  // KOSTYL 2.0
  if (props.allMapRoutes) {
    props.allMapRoutes.forEach((r, index) => {
      const mode = r.mobility.name.toUpperCase();
      let travelMode = mode;
      if (mode === 'CAR') {
        travelMode = 'DRIVING';
      }
      if (
        props['directions_' + index] &&
        props['directions_' + index].request
      ) {
        props['directions_' + index].request.travelMode = travelMode;
      }
    });
  }

  return (
    <GoogleMap
      {...getGoogleMapProps()}
      defaultOptions={defaultMapProps}
      ref={props.onMapMounted}
    >
      {!props.globalMap &&
        props.properties.map(item => (
          <Marker
            key={item.id}
            onClick={() => {
              console.log(item.lat, item.lng);
            }}
            position={{ lat: item.coords[0], lng: item.coords[1] }}
            name="Current location"
          />
        ))}

      {props.allRoutes &&
        props.allRoutes[0] &&
        props.allRoutes[0].waypoint &&
        props.allRoutes.map((route, index) => (
          <DirectionsRenderer
            options={{
              streetViewControl: false,
              polylineOptions: {
                strokeColor:
                  (route.categories[0] && route.categories[0].color) ||
                  '#2C855B',
                strokeOpacity: 1,
                strokeWeight: 2,
              },
              markerOptions: {
                icon: `${API_URL}${routeMarker}?radius=${MAP_MARKER_RADIUS}&color=${setColor(
                  route.categories[0].color
                )}`,
                visible: false,
              },
              //markerOptions: { icon: require(`../../../../assets/img/markers/oval.svg`) },
              //markerOptions: { icon: require(`../../../../assets/img/markers/${(route.categories[0].name).toLowerCase() || 'oval'}.svg`) },
              // icon: { scale: 3 }
            }}
            directions={props['directions_' + index]}
            key={index}
          />
        ))}
      {props.allRoutes &&
        props.allRoutes[0] &&
        props.allRoutes[0].waypoint &&
        props.allRoutes.map(route => {
          return route.waypoint.geometry.coordinates.map((item, ind) => {
            const coords = route.waypoint.geometry.coordinates[0];
            return (
              <Fragment key={Math.random()}>
                <Marker
                  onClick={() => {
                    detectRoute(route.id, props, coords[1], coords[0], ind);
                  }}
                  position={{ lat: item[1], lng: item[0] }}
                  name="Current location"
                  icon={`${API_URL}${routeMarker}?radius=${MAP_MARKER_RADIUS}&color=${setColor(
                    route.categories[0].color
                  )}`}
                  zIndex={2}
                >
                  {props.infoWindow.id === route.id &&
                    props.infoWindow.index === ind && (
                      <InfoWindowEx route={route} />
                    )}
                </Marker>
                <Marker
                  position={{ lat: coords[1], lng: coords[0] }}
                  icon={startImg}
                  zIndex={-1}
                />
              </Fragment>
            );
          });
        })}
    </GoogleMap>
  );
});

SearchMap.propTypes = {
  setTotalRouteStop: PropTypes.func,
  setTotalDistance: PropTypes.func,
  totalRouteStop: PropTypes.number,
  totalDistance: PropTypes.string,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchMap)
);
