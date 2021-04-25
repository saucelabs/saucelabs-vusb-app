// @flow
import React, { Component } from 'react';
import MenuItem from './MenuItem';
import LogoSL from '../assets/images/sauce-white-logo-small-color.png';
import Styles from './LeftMenu.styles.css';
import { ROUTES } from '../Routes';

const MenuItems = [
  {
    route: ROUTES.HOME,
    iconClass: 'fas fa-home',
    label: 'Home'
  },
  {
    route: ROUTES.DEVICES,
    iconClass: 'fas fa-mobile-alt',
    label: 'Device Catalog'
  },
  {
    route: ROUTES.SETTINGS,
    iconClass: 'fas fa-cogs',
    label: 'Settings'
  }
];

export default class LeftMenu extends Component<Props> {
  render() {
    return (
      <div className={Styles.menu}>
        <div className={Styles['logo-container']}>
          <img src={LogoSL} alt="Sauce Labs Logo" />
        </div>
        <ul>
          {MenuItems.map(menuItem => (
            <MenuItem
              key={menuItem.label}
              iconClass={menuItem.iconClass}
              label={menuItem.label}
              route={menuItem.route}
            />
          ))}
        </ul>
      </div>
    );
  }
}
