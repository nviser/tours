import {
  USER_JOURNAL_LIST_LOADING,
  USER_JOURNAL_LIST_LOADED,
  USER_JOURNAL_LIST_MORE_LOADED,
} from '../actions/userJournalList';

const initialState = {
  journalList: [],
  isLoadingJournalList: false,
  isCompleteJournalList: false,
};

export default (state = initialState, action = null) => {
  switch (action.type) {
    case USER_JOURNAL_LIST_LOADING:
      return { ...state, isLoadingJournalList: action.payload };
    case USER_JOURNAL_LIST_LOADED: {
      return {
        ...state,
        journalList: action.payload,
        isCompleteJournalList: false,
      };
    }
    case USER_JOURNAL_LIST_MORE_LOADED: {
      const journalList = state.journalList;
      const newItems = action.payload;

      if (!newItems || !newItems.length) {
        return {
          ...state,
          isCompleteJournalList: true,
        };
      }

      const newJournalList = journalList.concat(newItems);

      return {
        ...state,
        journalList: newJournalList,
      };
    }

    default:
      return state;
  }
};
