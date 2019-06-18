import React, { Component } from 'react';
import './EditDropDown.css';

export class EditDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      selectedValue: {},
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        opened: false,
      });
    }
  }

  toggleDropdown = () => {
    this.setState({
      opened: !this.state.opened,
    });
  };

  handleEdit = () => {
    this.toggleDropdown();
    this.props.onEdit();
  };

  handleDelete = () => {
    this.toggleDropdown();
    this.props.onDelete();
  };
  render() {
    return (
      <div
        className={`action-block ${this.state.opened ? 'active' : ''}`}
        ref={this.setWrapperRef}
      >
        <div className="toggle-dropdown" onClick={this.toggleDropdown}>
          <div className="icon-three-dots" />
        </div>
        <div className="action-dropdown">
          <div className="action-item edit" onClick={this.handleEdit}>
            <i className="fa fa-edit" />
            Edit
          </div>
          <div className="action-item delete" onClick={this.handleDelete}>
            <i className="fa fa-trash" />
            Delete
          </div>
        </div>
      </div>
    );
  }
}
