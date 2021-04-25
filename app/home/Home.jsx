// @flow
import React, {Component} from 'react';
import Styles from './Home.styles.css';
import ChecksContainer from "../components/Checks";
import VersionContainer from "../components/Version";

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={Styles.container}>
        <VersionContainer/>
        <ChecksContainer />
      </div>
    );
  }
}
