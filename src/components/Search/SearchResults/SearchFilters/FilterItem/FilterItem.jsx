import React, { Component } from 'react';

class FilterItem extends Component {
  state = {};

  render() {
    const { props } = this;
    return (
      <div
        className={`filter-item ${props.active ? 'active' : ''}`}
        onClick={props.toggleFilter}
      >
        <div className="filter-checkbox" />
        <div className="filter-title">{props.title}</div>
      </div>
    );
  }
}
export default FilterItem;
