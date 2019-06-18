import {
  SET_MULTIMEDIA_FILE,
  SET_PHOTOS,
  SET_TOUR_PHOTO,
  SET_TOUR_IMAGE_WIDTH,
  SET_AUDIO_FILE,
} from '../actions/types';

const initialState = {
  multimedia: null,
  audio: null,
  photos: [],
  tourPhoto: null,
  tourImageWidth: 400,
};

const setMultimediaFile = (state, action) => ({
  ...state,
  multimedia: action.payload,
});

const setPhotos = (state, action) => ({
  ...state,
  photos: action.payload,
});

const setTourPhoto = (state, action) => ({
  ...state,
  tourPhoto: action.payload,
});

const setTourImageWidth = (state, action) => ({
  ...state,
  tourImageWidth: action.payload,
});

const setAudioFile = (state, action) => ({
  ...state,
  audio: action.payload,
});

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_MULTIMEDIA_FILE:
      return setMultimediaFile(state, action);
    case SET_AUDIO_FILE:
      return setAudioFile(state, action);
    case SET_PHOTOS:
      return setPhotos(state, action);
    case SET_TOUR_PHOTO:
      return setTourPhoto(state, action);
    case SET_TOUR_IMAGE_WIDTH:
      return setTourImageWidth(state, action);
    default:
      return state;
  }
};
export default reducer;
