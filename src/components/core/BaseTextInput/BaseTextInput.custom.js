import React from 'react';
import { View, StyleSheet, TextInputProps } from 'react-native';
import PropTypes from 'prop-types';
import Row from '@src/components/Row';
import { COLORS, FONT } from '@src/styles';
import { SearchIcon } from '@src/components/Icons';
import { Text } from '@src/components/core';
import BaseTextInput from './BaseTextInput';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.colorGrey4,
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  inputStyle: {
    flex: 1,
    color: COLORS.black,
    fontSize: FONT.SIZE.medium,
    fontFamily: FONT.NAME.medium,
  },
});

const BaseTextInputCustom = (props) => {
  const inputProps: TextInputProps = props?.inputProps;
  const { canSearch = true, renderCustom } = props;
  const handleRenderCustom = () => {
    if (renderCustom) {
      return renderCustom;
    }
    return <View>{canSearch && <SearchIcon />}</View>;
  };
  return (
    <Row style={styled.container}>
      <BaseTextInput
        {...{
          ...inputProps,
          style: { ...styled.inputStyle, ...inputProps?.style },
        }}
      />
      {handleRenderCustom()}
    </Row>
  );
};

BaseTextInputCustom.propTypes = {
  inputProps: PropTypes.object,
  canSearch: PropTypes.bool,
  renderCustom: PropTypes.element,
};

export default React.memo(BaseTextInputCustom);
