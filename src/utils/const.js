export const SEARCH_SUGGESTIONS_LENGTH = 2;
export const REGULAR_USER_ROLE = 1;
export const USER_HEADER_NAME_LENGTH = 20;
export const AGENT_ROLE = 2;
export const SEARCH_PROPERTY_SUGGESTIONS_LENGTH = 2;
export const SEARCH_COMPANY_SUGGESTIONS_LENGTH = 2;
export const DEFAULT_MAP_PARAMS = {
  lat: 25.765095,
  lng: -80.21111,
  zoom: 14,
};
export const LINKEDIN = {
  CLIENT_ID: '86zrm2ma63egeo',
  SECRET_ID: 'ghBTk147gvcb1lSG',
  OAUTH2_API_1: 'https://www.linkedin.com/oauth/v2/authorization',
  OAUTH2_API_2: 'https://www.linkedin.com/oauth/v2/accessToken',
  STATE: 'DCEeFWf45A53sdfKef424',
};

export const GOOGLE_MAP_LAYOUT = [
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export const GET_IP_API = 'https://api.ipify.org/?format=json';
export const GET_LOCATION_API = ip => `https://ipapi.co/${ip}/json/`;
export const MAP_MARKER_RADIUS = 7;
export const APP_STORE_PATH = 'http://builtstory.com/';
export const FAQ_PAGE = 'https://www.builtstory.com/faqs';
export const STRIPE_SECURE_LINK = 'https://stripe.com/docs/security/stripe';
