import Styles from './CloseIconButton.module.css';

const CloseIconButton = () => {
  return <i className={`${Styles.icon} ${Styles.hover} fas fa-times`} />;
};

export default CloseIconButton;
