// @flow
import React, {Component} from 'react';
import Styles from './Tab.styles.css';

type Props = {
  activeTab: string,
  iconClass: string,
  label: string,
  onClick: () => void,
};

export default class Tab extends Component<Props> {
  props: Props;

  onClick = () => {
    const {label, onClick} = this.props;
    onClick(label);
  }

  render() {
    const {activeTab, iconClass, label} = this.props;
    return (
      <li
        className={`${Styles['tab-list-item']}${activeTab === label ? ' ' + Styles['tab-list-active']: ''}`}
        onClick={this.onClick}
      >
        <i className={`fas ${iconClass}`} /> {label}
      </li>
    );
  }
}
