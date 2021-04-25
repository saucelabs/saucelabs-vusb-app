// @flow
import React, { Component } from 'react';
import Styles from './Terminal.styles.css';
import LogLines from './LogLines';

type Props = {
  clearLogs: () => void,
  logLines: []
};

export default class Terminal extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.keydownListener = this.keydownListener.bind(this);
  }

  // Copied this from Appium-Desktop =)
  keydownListener(e) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      this.props.clearLogs();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keydownListener);
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownListener);
  }

  scrollToBottom() {
    this.bottom.scrollIntoView();
  }

  render() {
    const { logLines } = this.props;

    return (
      <div className={Styles.container}>
        <LogLines logLines={logLines} />
        <div
          ref={el => {
            this.bottom = el;
          }}
        />
      </div>
    );
  }
}
