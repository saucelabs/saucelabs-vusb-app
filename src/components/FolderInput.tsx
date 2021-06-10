import React, { useRef } from 'react';
import { remote } from 'electron';
import Styles from './FolderInput.module.css';

interface FolderInputInterface {
  label?: string;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
}

const { dialog } = remote;
const FolderInput: React.FC<FolderInputInterface> = ({
  label,
  name,
  onChange,
  value,
}) => {
  const folderInputRef = useRef<HTMLInputElement>(null);
  const getLocalFilePath = () => {
    const dialogSync = dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    });

    if (dialogSync && folderInputRef && folderInputRef.current) {
      const [dir] = dialogSync;
      // From https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-onchange-event-in-react-js
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter?.call(folderInputRef.current, dir);

      const ev2 = new Event('input', { bubbles: true });
      folderInputRef.current.dispatchEvent(ev2);
    }
  };

  return (
    <div>
      {label && (
        <label className={Styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <div className={Styles.cover}>
        <input
          className={Styles['folder-input']}
          id={name}
          name={name}
          onChange={onChange}
          onClick={getLocalFilePath}
          readOnly
          ref={folderInputRef}
          type="text"
          value={value}
        />
      </div>
    </div>
  );
};

export default FolderInput;
