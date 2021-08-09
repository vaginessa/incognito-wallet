import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ButtonBasic } from '@src/components/Button';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  btnStyle: {
    flex: 1,
    width: '50%',
    maxWidth: '48%',
  },
  btnStyleEnabled: {
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: COLORS.white,
  },
  btnStyleDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  titleStyle: {
    color: COLORS.colorBlue,
  },
  titleDisabledStyle: {
    color: COLORS.colorGreyMedium,
  },
});

const Tab = (props) => {
  const { activeTab, label, onClickTab, tabID } = props;
  const onClick = () => typeof onClickTab === 'function' && onClickTab(tabID);
  const disabled = tabID !== activeTab;
  return (
    <ButtonBasic
      title={label}
      onPress={onClick}
      btnStyle={[
        styled.btnStyle,
        disabled ? styled.btnStyleDisabled : styled.btnStyleEnabled,
      ]}
      titleStyle={[
        styled.titleStyle,
        disabled ? styled.titleDisabledStyle : null,
      ]}
    />
  );
};

Tab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClickTab: PropTypes.func.isRequired,
  tabID: PropTypes.string.isRequired,
};

export default React.memo(Tab);
