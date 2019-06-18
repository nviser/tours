import React, { Component } from 'react';
import './CustomSelect.css';

export class CustomSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      single: {},
      multiple: [],
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  setSelected = props => {
    if (props.selected && props.options) {
      switch (props.mode) {
        case 'multiple': {
          const _items = [];
          for (let i = 0; i < props.selected.length; i++) {
            for (let j = 0; j < props.options.length; j++) {
              if (
                parseInt(props.options[j].id, 10) ===
                parseInt(props.selected[i].id, 10)
              ) {
                _items.push(props.options[j]);
              }
            }
          }
          this.setState({ multiple: _items });
          break;
        }
        case 'single': {
          for (let i = 0; i < props.options.length; i++) {
            if (
              parseInt(props.options[i].id, 10) === parseInt(props.selected, 10)
            ) {
              this.setState({ single: props.options[i] });
              break;
            }
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  };

  componentWillReceiveProps(newProps) {
    this.setSelected(newProps);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.setSelected(this.props);
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

  selectOption = (option, $e) => {
    $e.stopPropagation();
    switch (this.props.mode) {
      case 'single': {
        this.setState(
          {
            single: option,
          },
          () => {
            this.toggleSelect();
            this.props.onChange(
              this.state.single[this.props.fieldToSend],
              this.props.name
            );
          }
        );
        break;
      }
      case 'multiple': {
        const _updates = JSON.parse(JSON.stringify(this.state.multiple));
        if (_updates.length) {
          for (let i = 0; i < this.state.multiple.length; i++) {
            if (parseInt(_updates[i].id, 10) === parseInt(option.id, 10)) {
              _updates.splice(i, 1);
              break;
            } else if (i === _updates.length - 1) {
              _updates.push(option);
            }
          }
        } else {
          _updates.push(option);
        }
        this.setState({ multiple: _updates }, () => {
          this.props.onChange(this.state.multiple, this.props.name);
        });
        break;
      }
      default: {
        break;
      }
    }
  };

  toggleSelect = () => {
    this.setState({
      opened: !this.state.opened,
    });
  };

  resolveSelected = item => {
    switch (this.props.mode) {
      case 'multiple': {
        for (let i = 0; i < this.state.multiple.length; i++) {
          if (
            parseInt(this.state.multiple[i].id, 10) === parseInt(item.id, 10)
          ) {
            return true;
          }
        }
        break;
      }
      case 'single': {
        return parseInt(this.state.single.id, 10) === parseInt(item.id, 10);
      }
      default: {
        break;
      }
    }
  };

  resolveNotEmpty = () => {
    return (
      this.state.multiple.length || (this.state.single && this.state.single.id)
    );
  };

  resolveDisplaySelected = () => {
    switch (this.props.mode) {
      case 'multiple': {
        const _template = [];
        for (let i = 0; i < this.state.multiple.length; i++) {
          _template.push(
            <span key={i} className="selected-item-multiple">
              {this.state.multiple[i][this.props.fieldToShow]}
              <span className="separator">, </span>
            </span>
          );
        }
        return _template.length ? _template : null;
      }
      case 'single': {
        return this.state.single[this.props.fieldToShow];
      }
      default: {
        break;
      }
    }
  };

  render() {
    const { options, fieldToShow, placeholder, label, isRequired } = this.props;
    return (
      <div
        className={`custom-select-group ${this.props.mode} ${
          this.state.opened ? 'opened' : 'closed'
        }`}
        ref={this.setWrapperRef}
      >
        <label className="modal-sign-in-label">
          <span>{label}</span>
          {isRequired && <sup className="warn-color">*</sup>}
        </label>
        <div
          className={`custom-select-group-select`}
          onClick={this.toggleSelect}
        >
          <span
            className={`selected-value ${
              this.resolveNotEmpty() ? '' : 'placeholder'
            }`}
          >
            {this.resolveDisplaySelected() || placeholder}
          </span>
          <i
            className={`fa ${
              this.state.opened ? 'fa-caret-up' : 'fa-caret-down'
            }`}
          />
        </div>
        <div className="custom-select-options">
          {options &&
            Array.isArray(options) &&
            options.map(item => (
              <div
                className={`custom-select-option ${
                  this.resolveSelected(item) ? 'selected' : ''
                }`}
                onClick={this.selectOption.bind(this, item)}
                key={item.id}
              >
                <span className={`bullet ${this.props.mode}`}>
                  <i
                    className={`fa ${
                      this.props.mode === 'single' ? 'fa-circle' : 'fa-check'
                    }`}
                  />
                </span>
                {item[fieldToShow]}
              </div>
            ))}
        </div>
      </div>
    );
  }
}
