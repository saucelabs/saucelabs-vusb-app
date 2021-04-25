// @flow
import React, {Component} from 'react';
import Styles from './Button.styles.css';

type Props = {
  label: string,
  disabled?: boolean
};

export default class Button extends Component<Props> {
  props: Props;

  static defaultProps = {
    disabled: false
  };

  render() {
    const {label, disabled} = this.props;

    return (
      <button disabled={disabled} className={Styles.button} type="submit">
        {label}
      </button>
    );
  }
}
