/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from 'react';
import Styles from './Dropdown.module.css';

type DropdownType = {
  defaultOption: string;
  noOptionsLabel?: string;
  noOptionsComponent?: React.ReactNode;
  onSelect: (option: string) => void;
  options: OptionType[];
  selected: string;
};
type OptionType = {
  key: string;
  value: string;
};

const Dropdown: React.FC<DropdownType> = ({
  defaultOption,
  noOptionsLabel,
  noOptionsComponent,
  onSelect,
  options,
  selected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownNode = useRef<HTMLDivElement>(null);
  const openCloseDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    onSelect(event.currentTarget.getAttribute('data-key') as string);
    setIsOpen(false);
  };
  const menu = isOpen ? (
    <div className={Styles.menuContainer}>
      <button
        className={`${Styles.dropdownOption} ${!selected ? Styles.active : ''}`}
        data-key=""
        onClick={handleSelect}
        type="button"
      >
        {defaultOption}
      </button>
      {options.map(({ key, value }) => (
        <button
          className={`${Styles.dropdownOption} ${
            key === selected ? Styles.active : ''
          }`}
          data-key={key}
          onClick={handleSelect}
          type="button"
        >
          {value}
        </button>
      ))}
    </div>
  ) : null;

  useEffect(() => {
    const listener = (event: React.MouseEvent<HTMLDivElement>) => {
      // Do nothing if clicking ref's element or descendent elements
      if (
        dropdownNode.current &&
        !dropdownNode.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // @ts-ignore
    document.addEventListener('mousedown', listener, false);

    // @ts-ignore
    return () => document.removeEventListener('mousedown', listener, false);
  }, [dropdownNode, setIsOpen]);

  return (
    <>
      {options.length === 0 ? (
        <div className={`${Styles.noOptions} ${Styles.label}`}>
          {noOptionsComponent || noOptionsLabel}
        </div>
      ) : (
        <div ref={dropdownNode} className={Styles.dropdownMainContainer}>
          <button
            className={`${Styles.dropdownContainer} ${
              isOpen ? Styles.open : ''
            }`}
            onClick={openCloseDropdown}
            type="button"
          >
            <div className={Styles.label}>
              {selected || defaultOption}
              <svg
                className={Styles.arrow}
                preserveAspectRatio="xMidYMid"
                width="11"
                height="7"
                viewBox="0 0 11 7"
              >
                <path
                  d="M11.013,1.406 C11.013,1.406 6.896,5.593 6.896,5.593 C6.896,5.593 6.902,5.599 6.902,5.599 C6.902,5.599 5.500,7.013 5.500,7.013 C5.500,7.013 4.098,5.599 4.098,5.599 C4.098,5.599 4.104,5.593 4.104,5.593 C4.104,5.593 -0.013,1.406 -0.013,1.406 C-0.013,1.406 1.389,-0.008 1.389,-0.008 C1.389,-0.008 5.500,4.173 5.500,4.173 C5.500,4.173 9.611,-0.008 9.611,-0.008 C9.611,-0.008 11.013,1.406 11.013,1.406 Z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </button>
          {menu}
        </div>
      )}
    </>
  );
};
Dropdown.defaultProps = {
  noOptionsComponent: null,
  noOptionsLabel: 'No options provided nor a "noOptionsComponent" provided',
};

export default Dropdown;
export { OptionType };
