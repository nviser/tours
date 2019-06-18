import { ADD_POST, SET_POSTS } from '../actions/types';

export default (state = [], action = {}) => {
  switch (action.type) {
    case ADD_POST:
      return [
        ...state,
        {
          id: action.id,
          content: action.content,
          event_date: action.event_date,
          post_type: action.post_type,
          property: action.property,
          company: action.company,
          user: action.user,
          post_document: action.post_document,
        },
      ];
    case SET_POSTS:
      return action.payload;
    default:
      return state;
  }
};
