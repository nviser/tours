import React, { Component } from 'react';

const defaultHeight = 18;

class TextareaAutoHeight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.props.minRows || 1,
    };
  }

  onChangeTextArea = evt => {
    const textarea = evt.nativeEvent.target;
    const lineHeight = this.props.lineHeight || defaultHeight;
    const min = this.props.minRows || 1;
    const max = this.props.maxRows;

    textarea.rows = min;
    let newRows = ~~(textarea.scrollHeight / lineHeight);
    if (max && newRows > max) newRows = max;

    textarea.rows = newRows;

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(textarea.value);
    }
  };

  render() {
    const {
      lineHeight = defaultHeight,
      placeholder = '',
      minRows = 1,
      className = '',
      value = '',
    } = this.props;

    return (
      <textarea
        className={className}
        rows={minRows}
        style={{ lineHeight: `${lineHeight}px` }}
        placeholder={placeholder}
        value={value}
        onChange={this.onChangeTextArea}
      />
    );
  }
}

export default TextareaAutoHeight;
