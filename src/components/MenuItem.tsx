import React from 'react';
import { NavLink } from 'react-router-dom';
import Styles from './MenuItem.module.css';
import { MenuItemType } from '../types/ComponentTypes';

const MenuItem = ({ iconClass, label, route }: MenuItemType) => {
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
