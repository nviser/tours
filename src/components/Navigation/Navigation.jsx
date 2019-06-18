import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from '../../components/HomePage/HomePage';
import UserLogInPage from '../../components/User/UserLogInPage/UserLogInPage';
import UserSignUpPage from '../User/UserSignUpPage/UserSignUpPage';
import UserDashboard from '../User/UserDashboard/UserDashboard';
import UserTours from '../User/UserTours/UserTours';
import TourPurchased from '../User/UserTours/TourPurchased/TourPurchased';
import TourCreate from '../User/UserTours/TourCreate/TourCreate';
import TourCreate2 from '../User/UserTours/TourCreate2';
import TourStop from '../User/UserTours/TourStop/TourStop';
import TourStopList from '../User/UserTours/TourStopList/TourStopList';
import UserPage from '../../containers/UserPage/UserPage';
import CompanyPage from '../../components/CompanyPage/CompanyPage';
import PropertyPage from '../../components/PropertyPage/PropertyPage';
import SearchResults from '../../components/Search/SearchResults/SearchResults';
import NotFoundPageComponent from '../../components/NotFoundPageComponent/NotFoundPageComponent';
import RestrictedPage from '../../components/RestrictedPage/RestrictedPage';
import AboutUs from '../../components/AboutUs/AboutUs';
import TermsConditions from '../../components/TermsConditions/TermsConditions';
import PrivacyPolicy from '../../components/PrivacyPolicy/PrivacyPolicy';
import ThankPage from '../../components/ThankPage/ThankPage';
import RouteComponent from '../../components/Routes/RouteComponent/RouteComponent';
import RoutesComponent from '../../components/Routes/RoutesComponent/RoutesComponent';
import UserEditPage from '../User/UserEditPage/UserEditPage';
import CompanyEditPage from '../Company/CompanyEditPage/CompanyEditPage';
import TourOperatorRegister from '../../components/TourOperator/TourOperatorRegister/TourOperatorRegister';
import TourOperatorDashboard from '../../components/TourOperator/TourOperatorDashboard/TourOperatorDashboard';
import TourOperatorSalesHistory from '../../components/TourOperator/TourOperatorSalesHistory/TourOperatorSalesHistory';
import TourOperatorPayouts from '../../components/TourOperator/TourOperatorPayouts/TourOperatorPayouts';
import TourSuccess from '../../components/User/UserTours/TourSuccess/TourSuccess';
import UserForgotPassword from '../../components/User/UserForgotPassword/UserForgotPassword';
import UserJournal from '../User/UserJournal/UserJournal';
import UserResetPassword from '../User/UserResetPassword/UserResetPassword';
import TourStopEdit from '../User/UserTours/TourStopEdit/TourStopEdit';
import TourPreview from '../User/UserTours/TourPreview/TourPreview';
import TourDetails from '../User/UserTours/TourDetails/TourDetails';
import PaymentMethods from '../../components/PaymentMethods/PaymentMethods';
import CreatePaymentMethod from '../PaymentMethods/CreatePaymentMethod/CreatePaymentMethod';
import MerchantProfile from '../../components/MerchantProfile/MerchantProfile';
import MerchantAccount from '../../components/MerchantAccount/MerchantAccount';
import UserEditAccount from '../../components/User/UserEditAccount/UserEditAccount';
import FavoriteTours from '../User/UserTours/FavoriteTours/FavoriteTours';
import MerchantPage from '../TourOperator/MerchantPage/MerchantPage';

import {
  homePath,
  logInPath,
  signUpPath,
  dashboardPath,
  userToursPath,
  toursPurchasedPath,
  tourInfoPath,
  tourStopPath,
  tourStopListPath,
  userIdPath,
  companyIdPath,
  propertyIdPath,
  searchPath,
  aboutUsPath,
  termsPath,
  policyPath,
  thankPagePath,
  routePath,
  routesPath,
  editUserPath,
  editCompanyPath,
  tourOperatorRegister,
  creatorDashboard,
  salesHistory,
  payouts,
  tourCreateSuccess,
  forgotPassword,
  passwordReset,
  tourStopEdit,
  tourPreview,
  tourDetails,
  userJournalPath,
  paymentMethods,
  createPaymentMethod,
  agentProfile,
  merchantAccount,
  userEditAccount,
  favoriteTours,
  merchantPage,
  restrictedRoute,
} from '../../utils/paths';

const Navigation = ({ role }) => (
  <Router>
    <Switch>
      <Route exact path={homePath} component={HomePage} />
      <Route exact path={logInPath} component={UserLogInPage} />
      <Route exact path={signUpPath} component={UserSignUpPage} />
      <Route exact path={dashboardPath} component={UserDashboard} />
      <Route exact path={userToursPath} component={UserTours} />
      <Route exact path={toursPurchasedPath} component={TourPurchased} />
      <Route exact path={tourInfoPath} component={TourCreate} />
      <Route exact path="/tours/create/tour_info2" component={TourCreate} />
      <Route exact path={tourDetails} component={TourDetails} />
      <Route exact path={tourStopPath} component={TourStop} />
      <Route exact path={tourStopListPath} component={TourStopList} />
      <Route exact path={userIdPath} component={UserPage} />
      <Route exact path={editUserPath} component={UserEditPage} />
      <Route exact path={editCompanyPath} component={CompanyEditPage} />
      <Route exact path={companyIdPath} component={CompanyPage} />
      <Route exact path={propertyIdPath} component={PropertyPage} />
      <Route exact path={searchPath} component={SearchResults} />
      <Route exact path={aboutUsPath} component={AboutUs} />
      <Route exact path={termsPath} component={TermsConditions} />
      <Route exact path={policyPath} component={PrivacyPolicy} />
      <Route exact path={thankPagePath} component={ThankPage} />
      <Route exact path={routePath} component={RouteComponent} />
      <Route exact path={routesPath} component={RoutesComponent} />
      <Route
        exact
        path={tourOperatorRegister}
        component={TourOperatorRegister}
      />
      <Route exact path={creatorDashboard} component={TourOperatorDashboard} />
      <Route exact path={salesHistory} component={TourOperatorSalesHistory} />
      <Route exact path={payouts} component={TourOperatorPayouts} />
      <Route exact path={tourCreateSuccess} component={TourSuccess} />
      <Route exact path={forgotPassword} component={UserForgotPassword} />
      <Route exact path={userJournalPath} component={UserJournal} />
      <Route exact path={passwordReset} component={UserResetPassword} />
      <Route exact path={tourStopEdit} component={TourStopEdit} />
      <Route exact path={tourPreview} component={TourPreview} />
      <Route exact path={paymentMethods} component={PaymentMethods} />
      <Route exact path={createPaymentMethod} component={CreatePaymentMethod} />
      <Route exact path={agentProfile} component={MerchantProfile} />
      <Route exact path={merchantPage} component={MerchantPage} />
      <Route exact path={merchantAccount} component={MerchantAccount} />
      <Route exact path={userEditAccount} component={UserEditAccount} />
      <Route exact path={favoriteTours} component={FavoriteTours} />
      <Route path={restrictedRoute} component={RestrictedPage} />
      <Route path="*" exact component={NotFoundPageComponent} />
    </Switch>
  </Router>
);

export default Navigation;
