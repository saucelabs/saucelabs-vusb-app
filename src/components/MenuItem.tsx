import React from 'react';
import { NavLink } from 'react-router-dom';
import Styles from './MenuItem.module.css';

interface MenuItemInterface {
  route: string;
  iconClass: string;
  label: string;
}

const MenuItem: React.FC<MenuItemInterface> = ({ iconClass, label, route }) => {
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
};

export default MenuItem;
export { MenuItemInterface };
