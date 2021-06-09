/**
 * Reused a lot of code from Appium-Desktop here
 */
import React from 'react';
import Icon from '@material-ui/core/Icon';
import AnsiConverter from 'ansi-to-html';
import Styles from './LogLines.module.css';
import { MAX_LOG_LINES } from '../../utils/Constants';

const LogLines = ({ logLines }: { logLines: string[] }) => {
  const getIcon = (level: string): string => {
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
  };
  const getLogLevel = (logLine: string): string => {
    if (/ERROR/.test(logLine)) {
      return 'error';
    }
    if (/WARN/.test(logLine)) {
      return 'warn';
    }
    if (/DEBUG/.test(logLine)) {
      return 'debug';
    }
    if (/INFO/.test(logLine)) {
      return 'info';
    }

    return 'transparent';
  };
  const convert = new AnsiConverter({ fg: '#bbb', bg: '#222' });

  return (
    <>
      {logLines
        .slice(logLines.length - MAX_LOG_LINES)
        .map((line: string, i: number) => {
          const level = getLogLevel(line);
          const iconType = getIcon(level);

          return (
            line && (
              // eslint-disable-next-line react/no-array-index-key
              <div className={Styles.logLine} key={i}>
                <Icon
                  className={`${iconType} ${Styles.icon} ${Styles[level]}`}
                />
                <span
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: convert.toHtml(line) }}
                />
              </div>
            )
          );
        })}
    </>
  );
};

export default LogLines;
