import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ButtonBasic } from '@src/components/Button';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  btnStyle: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginRight: 24,
  },
  btnStyleEnabled: {
    borderBottomColor: COLORS.colorBlue,
  },
  btnStyleDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  titleStyle: {
    color: COLORS.black,
    padding: 0,
    margin: 0,
    fontSize: FONT.SIZE.regular,
    fontFamily: FONT.NAME.medium,
    lineHeight: FONT.SIZE.regular + 5,
  },
  titleDisabledStyle: {
    color: COLORS.colorGreyLight,
  },
});

const Tab1 = (props) => {
  const {
    activeTab,
    label,
    onClickTab,
    tabID,
    tabStyled,
    tabStyledDisabled,
    titleStyled,
    titleDisabledStyled,
    tabStyledEnabled,
    upperCase,
  } = props;
  const onClick = () => typeof onClickTab === 'function' && onClickTab(tabID);
  const disabled = tabID !== activeTab;
  return (
    <ButtonBasic
      title={upperCase && label ? label.toUpperCase() : label}
      onPress={onClick}
      btnStyle={
        tabStyled
          ? [tabStyled, disabled ? tabStyledDisabled : tabStyledEnabled]
          : [
            styled.btnStyle,
            disabled ? styled.btnStyleDisabled : styled.btnStyleEnabled,
          ]
      }
      titleStyle={
        titleStyled
          ? [titleStyled, disabled ? titleDisabledStyled : null]
          : [styled.titleStyle, disabled ? styled.titleDisabledStyle : null]
      }
    />
  );
};

Tab1.defaultProps = {
  tabStyled: null,
  titleStyled: null,
  tabStyledDisabled: null,
  titleDisabledStyled: null,
  tabStyledEnabled: null,
  upperCase: true
};

Tab1.propTypes = {
  activeTab: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClickTab: PropTypes.func.isRequired,
  tabID: PropTypes.string.isRequired,
  tabStyled: PropTypes.any,
  tabStyledDisabled: PropTypes.any,
  titleStyled: PropTypes.any,
  titleDisabledStyled: PropTypes.any,
  tabStyledEnabled: PropTypes.any,
  upperCase: PropTypes.bool
};

export default React.memo(Tab1);
