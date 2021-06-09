import React from 'react';
import Styles from './Tab.module.css';

type TabType = {
  activeTab: string;
  iconClass: string;
  label: string;
  onClick: (arg: string) => void;
};

const Tab: React.FC<TabType> = ({ activeTab, iconClass, label, onClick }) => {
  return (
    <>
      <li
        className={`${Styles['tab-list-item']}${
          activeTab === label ? ` ${Styles['tab-list-active']}` : ''
        }`}
      >
        <button type="button" onClick={() => onClick(label)}>
          <i className={`fas ${iconClass}`} /> {label}
        </button>
      </li>
    </>
  );
};

export default Tab;