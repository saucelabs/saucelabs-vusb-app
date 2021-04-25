// @flow
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Styles from './MenuItem.styles.css';

type Props = {
  route: string,
  iconClass: string,
  label: string
};

export default class MenuItem extends Component<Props> {
  props: Props;

  render() {
    const { route, iconClass, label } = this.props;

    return (
      <li className={Styles['menu-item']}>
        <NavLink
          exact
          to={route}
          className={Styles.link}
          activeClassName={Styles.selected}
        >
          <i className={`${iconClass} ${Styles.icon}`} />
          <span className={Styles.label}>{label}</span>
        </NavLink>
      </li>
    );
  }
}
