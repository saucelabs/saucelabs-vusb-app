// @flow
import React, { Component } from 'react';
import Styles from './CloseIcon.syles.css';

type Props = {
  onClick: () => void
};

export default class CloseIcon extends Component<Props> {
  props: Props;

  render() {
    return (
      <i
        className={`${Styles.icon} ${Styles.hover} far fa-window-close`}
        onClick={() => this.props.onClick()}
      />
    );
  }
}
