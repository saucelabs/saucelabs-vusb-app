import React from 'react';
import Styles from './Header.module.css';
import SauceBolt from '../assets/images/sauce-bolt.png';

const Header: React.FC<{ headerComponents?: JSX.Element[]; title: string }> = ({
  headerComponents,
  title,
}) => {
  const separatorNeeded = headerComponents
    ? headerComponents?.length > 1
    : false;

  return (
    <div className={Styles.container}>
      <div className={Styles.logo}>
        <img src={SauceBolt} alt="Sauce Labs Bolt" />
      </div>
      <div className={Styles.label}>{title}</div>
      <div className={Styles.divider} />
      {headerComponents &&
        headerComponents.map((component) => (
          <>
            {separatorNeeded && <div className={Styles.separator} />}
            <div className={Styles.buttonContainer}>{component}</div>
          </>
        ))}
    </div>
  );
};

export default Header;
