import React from 'react';

function format(text) {
  return text != null ? text : '';
}

function unformat(text) {
  return text.trim().length === 0 ? null : text;
}

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: format(props.value),
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(e) {
    const { value } = e.target;
    this.setState({ value });
  }

  onBlur(e) {
    const { value } = this.state;
    const { onChange } = this.props;
    onChange(e, unformat(value));
  }

  render() {
    const { value } = this.state;
    const { tag = 'input', ...props } = this.props;

    return React.createElement(tag, {
      ...props,
      value,
      onChange: this.onChange,
      onBlur: this.onBlur,
    });
  }
}
