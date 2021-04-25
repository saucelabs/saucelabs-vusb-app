// @flow
import React, {Component} from 'react';
import Tab from './Tab';
import Styles from './Tabs.styles.css';

type Props = {
  children: []
};

export default class Tabs extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.children[0].props.label,
    };
  }

  props: Props;

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const {children} = this.props;
    const {activeTab} = this.state;

    return (
      <div>
        <ol className={Styles['tab-list']}>
          {children.map((child) => {
            const { iconClass, label } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                iconClass={iconClass}
                key={label}
                label={label}
                onClick={this.onClickTabItem}
              />
            );
          })}
        </ol>
        <div className={Styles['tab-content']}>
          {children.map((child) => {
            if (child.props.label !== activeTab) {
              return undefined;
            }

            return child.props.children;
          })}
        </div>
      </div>
    );
  }
}
