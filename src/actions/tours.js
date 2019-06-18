import {
  SET_MULTIMEDIA_FILE,
  SET_PHOTOS,
  SET_TOUR_PHOTO,
  SET_TOUR_IMAGE_WIDTH,
  SET_AUDIO_FILE,
} from './types';

export const setMultimediaFile = payload => ({
  type: SET_MULTIMEDIA_FILE,
  payload,
});

export const setPhotos = payload => ({
  type: SET_PHOTOS,
  payload,
});

export const setTourPhoto = payload => ({
  type: SET_TOUR_PHOTO,
  payload,
});

export const setTourImageWidth = payload => ({
  type: SET_TOUR_IMAGE_WIDTH,
  payload,
});

export const setAudioFile = payload => ({
  type: SET_AUDIO_FILE,
  payload,
});
