import React from 'react';
import noTunnels from '../../assets/images/no-tunnels.png';
import tunnels from '../../assets/images/tunnels.png';
import Styles from './Slide.module.css';

const TunnelsSlide: React.FC = () => {
  return (
    <>
      <div className={Styles.slideTop}>
        <img alt="No Tunnels" src={noTunnels} width={525} />
        <br />
        <img alt="Tunnels" src={tunnels} width={525} />
      </div>
      <div className={Styles.slideBottom}>
        <div className={`${Styles.textContainer} ${Styles.widerTextContainer}`}>
          <span className={Styles.textContainerTitle}>
            Automatic Sauce Connect Tunnel Detection
          </span>
          <span>
            When you&#39;ve added your username and access key to the settings
            this GUI will automatically detect (see screenshots) if there are
            Sauce Connect Tunnels running which you can use.
          </span>
          <span>
            Check the info-icon, next to the <em>Tunnel Proxies</em> info-icon
            for more info, or click on the <em>set up a tunnel</em>-link if you
            don&#39;t know how to start a tunnel.
          </span>
        </div>
      </div>
    </>
  );
};

export default TunnelsSlide;
