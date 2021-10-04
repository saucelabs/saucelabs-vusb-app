import React, { useState } from 'react';
import Tab from './Tab';
import Styles from './Tabs.module.css';

interface TabsInterface {
  children: JSX.Element[];
}

const Tabs: React.FC<TabsInterface> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props['data-label']);

  const onClickTabItem = (tab: string) => setActiveTab(tab);

  return (
    <div className={Styles.tabsContainer}>
      <ol className={Styles.tabList}>
        {children.map((child) => {
          const {
            'data-iconClass': iconClass,
            'data-label': label,
          } = child.props;

          return (
            <Tab
              activeTab={activeTab}
              iconClass={iconClass}
              key={label}
              label={label}
              onClick={onClickTabItem}
            />
          );
        })}
      </ol>
      <div className={Styles.tabContent}>
        {children.map((child) => {
          if (child.props['data-label'] !== activeTab) {
            return undefined;
          }

          return child.props.children;
        })}
      </div>
    </div>
  );
};

export default Tabs;
