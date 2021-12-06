import React from 'react';
import {View, StyleSheet, TextInputProps, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Row from '@src/components/Row';
import { COLORS, FONT } from '@src/styles';
import { SearchIcon ,CloseIcon} from '@src/components/Icons';
import BaseTextInput from './BaseTextInput';

const styled = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  inputStyle: {
    flex: 1,
    color: COLORS.black,
    fontSize: FONT.SIZE.small,
    fontFamily: FONT.NAME.medium,
  },
});

const BaseTextInputCustom = (props) => {
  const inputProps: TextInputProps = props?.inputProps;
  const { canSearch, renderCustom, style, value } = props;
  const handleRenderCustom = () => {
    if (renderCustom) {
      return renderCustom;
    }
    return (
      <View>{canSearch && (
        value ? (
          <TouchableOpacity onPress={() => {
            inputProps && inputProps.onChangeText && inputProps.onChangeText('');
          }}
          ><CloseIcon size={22} />
          </TouchableOpacity>
        ) : <SearchIcon />
      )}
      </View>
    );
  };
  return (
    <Row style={[styled.container, style]}>
      <BaseTextInput
        {...{
          ...inputProps,
          style: { ...styled.inputStyle, ...inputProps?.style },
        }}
        value={value}
        placeholderTextColor={COLORS.lightGrey34}
      />
      {handleRenderCustom()}
    </Row>
  );
};

BaseTextInputCustom.defaultProps = {
  inputProps: {},
  canSearch: true,
  renderCustom: undefined,
  style: undefined,
  value: ''
};

BaseTextInputCustom.propTypes = {
  inputProps: PropTypes.object,
  canSearch: PropTypes.bool,
  renderCustom: PropTypes.element,
  style: PropTypes.object,
  value: PropTypes.any
};

export default React.memo(BaseTextInputCustom);
