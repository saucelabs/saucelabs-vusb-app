// @flow
import React, { Component } from 'react';
import Styles from './FolderInput.styles.css';

type Props = {
  label?: string,
  onClick: ()=> void,
  name: string,
  value: string,
  reference: {},
};

export default class FolderInput extends Component<Props> {
  props: Props;

  static defaultProps = {
    label: '',
  };

  render() {
    const {
      label,
      name,
      onClick,
      value,
      reference
    } = this.props;

    return (
      <div>
        {label && (
          <label className={Styles.label} htmlFor={name}>
            {label}
          </label>
        )}
        <div className={Styles.cover} onClick={onClick}>
          <input
            className={Styles['folder-input']}
            defaultValue={value}
            readOnly
            id={name}
            name={name}
            type='text'
            ref={reference}
          />
        </div>
      </div>
    );
  }
}
