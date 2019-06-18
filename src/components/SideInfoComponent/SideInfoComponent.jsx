import React, { Component } from 'react';
import './SideInfoComponent.css';

class SideInfoComponent extends Component {
  state = {
    title: '',
    text: '',
  };

  componentWillReceiveProps(nextProps) {
    this.setData(nextProps);
  }

  setData(props) {
    this.setState({
      title: props.title,
      text: props.text,
    });
  }

  render() {
    return (
      <div className="side-info">
        <h3 className="side-info-header">{this.state.title}</h3>
        <p>{this.state.text}</p>
      </div>
    );
  }
}

export default SideInfoComponent;
