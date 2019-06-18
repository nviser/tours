import { combineReducers } from 'redux';
import posts from './posts';
import postTypes from './postTypes';
import postTypeSelected from './postTypeSelected';
import postOptions from './postOptions';
import suggest from './suggest';
import user from './user';
import company from './company';
import property from './property';
import routes from './routes';
import auth from './auth';
import search from './search';
import modalDialog from './modalDialog';
import signUpForm from './signUpForm';
import signInForm from './signInForm';
import signUpMessages from './signUpMessages';
import signInMessages from './signInMessages';
import files from './files';
import loader from './loader';
import browser from './browser';
import map from './map';
import edit from './edit';
import signUpTourOperatorForm from './signUpTourOperatorForm';
import signUpTourOperatorFormMsg from './signUpTourOperatorFormMsg';
import userJournalList from './userJournalList';
import tours from './tours';
import paymentMethods from './paymentMethods';
import editTourOperatorForm from './editTourOperatorForm';
import editTourOperatorMsg from './editTourOperatorMsg';
import editUserAccountForm from './editUserAccountForm';
import editAccountFormMessages from './editAccountFormMessages';
import filters from './filters';
import fullScreen from './fullscreen';

export default combineReducers({
  posts,
  postTypes,
  postTypeSelected,
  postOptions,
  suggest,
  user,
  company,
  property,
  routes,
  auth,
  search,
  modalDialog,
  signUpForm,
  signInForm,
  signUpMessages,
  signInMessages,
  files,
  loader,
  browser,
  map,
  edit,
  signUpTourOperatorForm,
  signUpTourOperatorFormMsg,
  userJournalList,
  tours,
  paymentMethods,
  editTourOperatorForm,
  editTourOperatorMsg,
  editUserAccountForm,
  editAccountFormMessages,
  filters,
  fullScreen,
});
