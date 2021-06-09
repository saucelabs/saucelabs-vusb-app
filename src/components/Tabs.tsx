import React, { useState } from 'react';
import Tab from './Tab';
import Styles from './Tabs.module.css';

type TabsType = {
  children: JSX.Element[];
};

const Tabs: React.FC<TabsType> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props['data-label']);

  const onClickTabItem = (tab: string) => setActiveTab(tab);

  return (
    <div>
      <ol className={Styles['tab-list']}>
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
      <div className={Styles['tab-content']}>
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
