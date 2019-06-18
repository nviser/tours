import {
  ADD_POST,
  SET_POSTS,
  SET_POST_TYPES,
  SET_SELECTED_POST_TYPE,
} from '../actions/types';

export const addPost = (
  id,
  content,
  event_date,
  post_type,
  property,
  company,
  user,
  post_document
) => dispatch =>
  dispatch({
    type: ADD_POST,
    id,
    content,
    event_date,
    post_type,
    property,
    company,
    user,
    post_document,
  });

export const setPosts = payload => dispatch =>
  dispatch({
    type: SET_POSTS,
    payload,
  });

export const setPostTypes = payload => dispatch =>
  dispatch({
    type: SET_POST_TYPES,
    payload,
  });

export const setSelectedPostType = payload => dispatch =>
  dispatch({
    type: SET_SELECTED_POST_TYPE,
    payload,
  });
