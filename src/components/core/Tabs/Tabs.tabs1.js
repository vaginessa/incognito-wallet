import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { View } from '@src/components/core';
import Row from '@src/components/Row';
import { styled as tabsStyled } from './Tabs.styled';
import withTabs from './Tabs.enhance';

const styled = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const Tabs1 = (props) => {
  const { renderTabs, styledTabList, rightCustom } = props;
  return (
    <Row style={styled.container}>
      <View style={[tabsStyled.tabList, styledTabList]}>{renderTabs()}</View>
      {rightCustom}
    </Row>
  );
};

Tabs1.defaultProps = {
  styledTabList: null,
  rightCustom: null,
};

Tabs1.propTypes = {
  rootTabID: PropTypes.string.isRequired,
  styledTabList: PropTypes.any,
  onClickTabItem: PropTypes.func.isRequired,
  renderTabs: PropTypes.func.isRequired,
  rightCustom: PropTypes.any,
};

export default withTabs(React.memo(Tabs1));
