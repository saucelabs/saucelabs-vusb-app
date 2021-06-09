import React from 'react';
import Styles from './Home.module.css';
import ChecksContainer from '../components/Checks';
import VersionContainer from '../components/Version';

const Home: React.FC = () => {
  return (
    <div className={Styles.container}>
      <VersionContainer />
      <ChecksContainer />
    </div>
  );
};

export default Home;
