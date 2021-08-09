import React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { View } from '@src/components/core';
import { COLORS } from '@src/styles';
import { ExHandler } from '@src/services/exception';
import { actionChangeTab } from './Tabs.actions';
import { activedTabSelector } from './Tabs.selector';
import Tab from './Tabs.tab';

const styled = StyleSheet.create({
  tabs: {
    backgroundColor: 'transparent',
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.colorGreyLight1,
    borderRadius: 40,
    padding: 4,
  },
  //   tab: {
  //     flex: 1,
  //     maxWidth: '48%',
  //   },
  tabContent: {
    flex: 1,
  },
});

const Tabs = (props) => {
  const { children, beforeContent } = props;
  const activeTab = useSelector(activedTabSelector);
  const dispatch = useDispatch();
  const onClickTabItem = (tab) => {
    try {
      const foundTab = children.find((chil) => chil.props.tabID === tab);
      const { onChangeTab } = foundTab.props || {};
      if (activeTab !== tab) {
        dispatch(actionChangeTab(tab));
        if (typeof onChangeTab === 'function') {
          onChangeTab();
        }
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    if (children) {
      const { tabID, onChangeTab } = children[0].props || {};
      dispatch(actionChangeTab(tabID));
      if (typeof onChangeTab === 'function') {
        onChangeTab();
      }
    }
  }, []);
  return (
    <View style={styled.tabs}>
      <View style={styled.tabList}>
        {children.map((child) => {
          const { label, tabID } = child.props;
          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              onClickTab={onClickTabItem}
              tabID={tabID}
            />
          );
        })}
      </View>
      {beforeContent}
      <View style={styled.tabContent}>
        {children.map((child) => {
          if (child.props.tabID !== activeTab) return null;
          return child.props.children;
        })}
      </View>
    </View>
  );
};

export default React.memo(Tabs);
