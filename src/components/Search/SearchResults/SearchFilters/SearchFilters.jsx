import React, { Component } from 'react';
import { setFilters } from '../../../../actions/filters';
import { setRoutes } from '../../../../actions/routes';
import { connect } from 'react-redux';
import FilterItem from './FilterItem/FilterItem';
import filters from './filters';
import './SearchFilters.css';

const mapStateToProps = state => ({
  activeFilters: state.filters.activeFilters,
  allRoutes: state.routes.allRoutes,
});

const mapDispatchToProps = {
  setFilters,
  setRoutes,
};

class SearchFilters extends Component {
  state = {
    filters: filters,
    newFilters: [],
    allRoutes: [],
  };

  componentWillReceiveProps(next) {
    if (next.activeFilters.length !== this.props.activeFilters) {
      this.syncFilters(next.activeFilters);
    }
  }

  syncFilters = actFilts => {
    for (let key in filters) {
      filters[key].forEach((obj, ind) => {
        filters[key][ind].active = false;
      });
    }
    for (let key in filters) {
      filters[key].forEach(obj => {
        actFilts.forEach(activeItem => {
          if (obj.f_id === activeItem.f_id) {
            obj.active = true;
          }
        });
      });
    }
    this.setState({
      filters: filters,
    });
  };

  toggleFilter = (name, filterItem, index) => {
    this.state.filters[name].forEach(item => {
      if (filterItem.f_id === item.f_id) {
        filters[name][index].active = !filterItem.active;
        this.setState(
          prevState => ({
            ...prevState,
            filters: {
              ...prevState.filters,
              [name]: [...filters[name]],
            },
          }),
          () => {
            this.setFiltering(this.state.filters);
          }
        );
      }
    });
  };

  setFiltering = filts => {
    const newFilts = [];
    for (let key in filts) {
      filts[key].forEach(item => {
        if (item.active) {
          newFilts.push({
            id: item.id,
            f_id: item.f_id,
            title: item.title,
            active: item.active,
            type: key,
          });
        }
      });
    }
    this.setState({
      newFilters: newFilts,
    });
    this.props.setFilters(newFilts);
  };

  applyFilters = () => {
    this.props.applyFilters();
    this.props.filterData();
  };

  resetFilters = () => {
    for (let key in filters) {
      filters[key].forEach((item, i) => {
        filters[key][i].active = false;
      });
    }
    this.setState({
      filters: filters,
    });
    this.props.setFilters([]);
  };

  render() {
    return (
      <div className="filter-block pull-right">
        <div className="filters">
          <h3 className="filter-header top-header">Categories</h3>
          <div className="filter-body">
            {this.state.filters.categories.map((item, i) => (
              <FilterItem
                key={item.f_id}
                source={item.img}
                alt={item.alt}
                title={item.title}
                active={item.active}
                toggleFilter={() => this.toggleFilter('categories', item, i)}
              />
            ))}
          </div>
          <h3 className="filter-header">Age</h3>
          <div className="filter-body">
            {this.state.filters.ages.map((item, i) => (
              <FilterItem
                key={item.f_id}
                source={item.img}
                alt={item.alt}
                title={item.title}
                active={item.active}
                toggleFilter={() => this.toggleFilter('ages', item, i)}
              />
            ))}
          </div>
          <h3 className="filter-header">Mobility</h3>
          <div className="filter-body">
            {this.state.filters.mobility.map((item, i) => (
              <FilterItem
                key={item.f_id}
                source={item.img}
                alt={item.alt}
                title={item.title}
                active={item.active}
                toggleFilter={() => this.toggleFilter('mobility', item, i)}
              />
            ))}
          </div>
          <div className="filter-action-block">
            <button className="reset-btn" onClick={this.resetFilters}>
              reset
            </button>
            <button className="apply-btn" onClick={this.applyFilters}>
              apply
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchFilters);
