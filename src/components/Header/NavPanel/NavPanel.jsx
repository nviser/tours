import React, { Component } from 'react';
import { searchPath, tourInfoPath } from '../../../utils/paths';
import SearchService from '../../../services/SearchService/SearchService';
import { setLoader } from '../../../actions/loaderActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './NavPanel.css';
import NavItem from './NavItem/NavItem';

const mapDispatchToProps = {
  setLoader,
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  isUserActive: state.auth.isUserActive,
});

const headerItems = [{ name: 'create tour', link: tourInfoPath }];

class NavPanel extends Component {
  state = {
    isUserActive: true,
    items: headerItems,
    mapItem: {
      name: 'tour map',
      link: '/search',
    },
  };

  getLocation = () => {
    this.props.history.push(searchPath);
  };

  Search = new SearchService();

  render() {
    const items = this.state.items.map(item => (
        <NavItem key={item.name} item={item} />
      )),
      { pathname } = this.props.location;
    return (
      <div className="nav-panel">
        {pathname !== searchPath ? (
          <div className="nav-item map-item" onClick={() => this.getLocation()}>
            {this.state.mapItem.name}
          </div>
        ) : null}
        {items}
      </div>
    );
  }
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NavPanel)
);
