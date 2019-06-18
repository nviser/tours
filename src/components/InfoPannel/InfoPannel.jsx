import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import SideInfoComponent from '../SideInfoComponent/SideInfoComponent';
import AboutCompany from '../AboutCompany/AboutCompany';
import RouteInfo from '../Routes/RouteInfo/RouteInfo';
import MapContainer from '../MapContainer';
import UserEditMenu from '../User/UserEditPage/UserEditMenu/UserEditMenu';
import './InfoPannel.css';

const InfoPanelComponent = withRouter(props => <InfoPannel {...props} />);

const goTo = (path, props) => {
  props.history.push(path);
};

const InfoPannel = props => (
  <div className="info-pannel">
    {!props.itIsEditUserPage && !props.itIsEditCompanyPage ? (
      <MapContainer
        className="side-map"
        itIsProperty={props.itIsProperty}
        userPage={props.userPage}
      />
    ) : null}
    {!props.itIsEditUserPage && !props.itIsEditCompanyPage ? (
      <SideInfoComponent title={props.title} text={props.text} />
    ) : null}
    {props.match.path === '/company/:id' ? (
      <AboutCompany companyData={props.data} />
    ) : null}
    {props.isItRouteComponent ? <RouteInfo companyData={props.data} /> : null}
    {props.itIsEditUserPage || props.itIsEditCompanyPage ? (
      <UserEditMenu
        itIsEditUserPage={props.itIsEditUserPage}
        itIsEditCompanyPage={props.itIsEditCompanyPage}
        goTo={path => goTo(path, props)}
      />
    ) : null}
  </div>
);

InfoPannel.defaultProps = {
  title: null,
  text: null,
  data: null,
  isItRouteComponent: null,
  itIsProperty: null,
  userPage: null,
  itIsEditUserPage: null,
  itIsEditCompanyPage: null,
};
InfoPannel.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  data: PropTypes.instanceOf(Object),
  match: ReactRouterPropTypes.match.isRequired,
  isItRouteComponent: PropTypes.bool,
  itIsProperty: PropTypes.bool,
  userPage: PropTypes.bool,
  itIsEditUserPage: PropTypes.bool,
  itIsEditCompanyPage: PropTypes.bool,
};

export default InfoPanelComponent;
