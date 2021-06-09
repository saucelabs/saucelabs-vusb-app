import React, { useEffect, useRef } from 'react';
import Styles from './Terminal.module.css';
import LogLines from './LogLines';
import { TerminalType } from '../../types/ComponentTypes';

const Terminal = ({ clearLogs, logLines }: TerminalType) => {
  const bottomBar = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    bottomBar.current?.scrollIntoView();
  };
  // Copied this from Appium-Desktop =)
  const keydownListener = (keyboardEvent: KeyboardEvent) => {
    if (
      keyboardEvent.key === 'k' &&
      (keyboardEvent.metaKey || keyboardEvent.ctrlKey)
    ) {
      clearLogs();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', keydownListener);
    scrollToBottom();

    // cleaning up the listener
    return () => document.removeEventListener('keydown', keydownListener);
  });
  // Only update on log lines change
  useEffect(() => scrollToBottom(), [logLines]);

  return (
    <>
      <div className={Styles.container}>
        <LogLines logLines={logLines} />
        <div ref={bottomBar} />
      </div>
    </>
  );
};

export default Terminal;
