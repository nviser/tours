import React from 'react';
import './Modal.css';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }

  render() {
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={`Modal ${
            this.props.modalClass ? this.props.modalClass : ''
          }`}
          style={{
            transform: this.props.show
              ? 'translateY(0)'
              : 'translateY:(-100vh)',
            display: this.props.show ? 'block' : 'none',
          }}
        >
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}
export default Modal;
