import React from 'react';
import MenuItem, { MenuItemInterface } from './MenuItem';
import LogoSL from '../assets/images/sauce-white-logo-small-color.png';
import Styles from './LeftMenu.module.css';
import { ROUTES } from '../utils/Constants';

const MenuItems: MenuItemInterface[] = [
  {
    route: ROUTES.HOME,
    iconClass: 'fas fa-home',
    label: 'Home',
  },
  {
    route: ROUTES.DEVICES,
    iconClass: 'fas fa-mobile-alt',
    label: 'Device Catalog',
  },
  {
    route: ROUTES.SETTINGS,
    iconClass: 'fas fa-cogs',
    label: 'Settings',
  },
];
const LeftMenu: React.FC = () => {
  return (
    <div className={Styles.menu}>
      <div className={Styles['logo-container']}>
        <img src={LogoSL} alt="Sauce Labs Logo" />
      </div>
      <ul>
        {MenuItems.map((menuItem) => (
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
};

export default LeftMenu;
