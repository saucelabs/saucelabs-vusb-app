// @flow
import React, { Component } from 'react';
import Select from 'react-select';
import Styles from './Input.styles.css';

type Props = {
  disabled?: boolean,
  label?: string,
  name: string,
  onChange: () => void,
  options: {
    label: string,
    value: string
  }[],
  placeholder?: string,
  value: {
    label: string,
    value: string
  }
};

export default class SelectBox extends Component<Props> {
  props: Props;

  static defaultProps = {
    disabled: false,
    label: '',
    placeholder: null
  };

  render() {
    const {
      disabled,
      label,
      name,
      onChange,
      options,
      placeholder,
      value
    } = this.props;

    return (
      <div>
        {label && (
          <label className={Styles.label} htmlFor={name}>
            {label}
          </label>
        )}
        <Select
          isDisabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          options={options}
          name={name}
          styles={reactSelectCustom}
        />
      </div>
    );
  }
}

const reactSelectCustom = {
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #d8dde3',
    borderRadius: 0,
    boxShadow: 'inset 0 1px 2px 0 hsla(0, 0%, 63.5%, 0.5)',
    boxSizing: 'border-box',
    fontSize: '14px',
    height: '45px',
    padding: '4px',
    color: '#1395f0',
    '&:hover': {
      borderColor: state.isFocused ? '#66afe9' : provided.borderColor
    }
  }),
  menu: provided => ({
    ...provided,
    border: '1px solid #d8dde3',
    borderRadius: 0,
    boxShadow: 'inset 0 1px 2px 0 hsla(0, 0%, 63.5%, 0.5)',
    boxSizing: 'border-box'
  }),
  placeholder: provided => ({
    ...provided,
    color: '#eb3f47',
    fontWeight: 700
  }),
  singleValue: provided => ({
    ...provided,
    color: '#1395f0'
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#fff' : provided.color,
    background: state.isSelected ? '#1395f0' : provided.background,
    fontSize: '14px'
  })
};
