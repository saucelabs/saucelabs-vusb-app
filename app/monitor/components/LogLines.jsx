// @flow
/**
 * Reused a lot of code from Appium-Desktop here
 */
import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';
import AnsiConverter from 'ansi-to-html';
import Styles from './LogLines.styles.css';

const convert = new AnsiConverter({ fg: '#bbb', bg: '#222' });
const MAX_LOGS_RENDERED = 1000;

function getIcon(level) {
  switch (level) {
    case 'debug':
      return 'fas fa-comment-dots';
    case 'warn':
      return 'fas fa-exclamation-circle';
    case 'error':
      return 'fas fa-times-circle';
    case 'info':
    default:
      return 'fas fa-info-circle';
  }
}

function getLogLevel(logLine) {
  if (/ERROR/.test(logLine)) {
    return 'error';
  } else if (/WARN/.test(logLine)) {
    return 'warn';
  } else if (/DEBUG/.test(logLine)) {
    return 'debug';
  } else if (/INFO/.test(logLine)) {
    return 'info';
  }
  return 'transparent';
}

type Props = {
  logLines: []
};
export default class LogLines extends Component<Props> {
  props: Props;

  render() {
    const { logLines } = this.props;

    return logLines
      .slice(logLines.length - MAX_LOGS_RENDERED)
      .map((line, i) => {
        const level = getLogLevel(line);
        const iconType = getIcon(level);

        return (
          line && (
            <div className={Styles.logLine} key={i}>
              <Icon className={`${iconType} ${Styles.icon} ${Styles[level]}`} />
              <span
                dangerouslySetInnerHTML={{ __html: convert.toHtml(line) }}
              />
            </div>
          )
        );
      });
  }
}
