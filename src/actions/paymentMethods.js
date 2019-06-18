import { SET_PAYMENT_METHODS, SET_EDIT_CARD } from './types';

export const setPaymentMethods = payload => ({
  type: SET_PAYMENT_METHODS,
  payload,
});

export const setEditCard = payload => ({
  type: SET_EDIT_CARD,
  payload,
});
