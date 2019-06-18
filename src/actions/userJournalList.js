import ApiService from '../services/ApiService/ApiService';

export const USER_JOURNAL_LIST_LOADING = 'USER_JOURNAL_LIST_LOADING';
export const USER_JOURNAL_LIST_LOADED = 'USER_JOURNAL_LIST_LOADED';
export const USER_JOURNAL_LIST_MORE_LOADED = 'USER_JOURNAL_LIST_MORE_LOADED';

const LIMIT = 10;

const apiService = new ApiService();

const getJournalList = async offset => {
  try {
    return await apiService.getComponent(
      `/me/journal?limit=${LIMIT}&offset=${offset}`
    );
  } catch (err) {
    return err;
  }
};

const journalListLoading = status => {
  return {
    type: USER_JOURNAL_LIST_LOADING,
    payload: status,
  };
};

export const getList = () => {
  return async dispatch => {
    dispatch(journalListLoading(true));

    const response = await getJournalList(0);
    let list = [];

    if (response && response.status === 200 && response.data) {
      list = response.data;
    }

    dispatch({
      type: USER_JOURNAL_LIST_LOADED,
      payload: list,
    });

    dispatch(journalListLoading(false));

    return list;
  };
};

export const getMoreList = offset => {
  return async dispatch => {
    dispatch(journalListLoading(true));

    const response = await getJournalList(offset);
    let list = [];

    if (response && response.status === 200 && response.data) {
      list = response.data;
    }

    dispatch({
      type: USER_JOURNAL_LIST_MORE_LOADED,
      payload: list,
    });

    dispatch(journalListLoading(false));

    return list;
  };
};
